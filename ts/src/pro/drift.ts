// ----------------------------------------------------------------------------

import driftRest from '../drift.js';
import { AuthenticationError } from '../base/errors.js';
import { ArrayCacheByTimestamp, ArrayCache } from '../base/ws/Cache.js';
import type { Int, OrderBook, OHLCV, Dict, Bool, Trade } from '../base/types.js';
import Client from '../base/ws/Client.js';

// ----------------------------------------------------------------------------

export default class drift extends driftRest {
    describe (): any {
        return this.deepExtend (super.describe (), {
            'has': {
                'ws': true,
                'watchBalance': false,
                'watchMyTrades': false,
                'watchOHLCV': true,
                'watchOrderBook': true,
                'watchOrders': false,
                'watchTicker': false,
                'watchTickers': true,
                'watchBidsAsks': false,
                'watchTrades': true,
                'watchTradesForSymbols': false,
                'watchPositions': false,
            },
            'urls': {
                'api': {
                    'ws': {
                        'public': 'wss://data.api.drift.trade/ws',
                        'private': 'wss://ws-private-evm.orderly.org/v2/ws/private/stream',
                    },
                },
            },
            'options': {
                'tradesLimit': 1000,
                'ordersLimit': 1000,
            },
            'streaming': {
                'keepAlive': 10000,
            },
            'exceptions': {
                'ws': {
                    'exact': {
                    },
                },
            },
        });
    }

    async watchPublic (messageHash, subscribeHash, message) {
        const url = this.urls['api']['ws']['public'];
        return await this.watch (url, messageHash, message, subscribeHash, message);
    }

    /**
     * @method
     * @name drift#watchOHLCV
     * @description watches historical candlestick data containing the open, high, low, and close price, and the volume of a market
     * @param {string} symbol unified symbol of the market to fetch OHLCV data for
     * @param {string} timeframe the length of time each candle represents
     * @param {int} [since] timestamp in ms of the earliest candle to fetch
     * @param {int} [limit] the maximum amount of candles to fetch
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {int[][]} A list of candles ordered as timestamp, open, high, low, close, volume
     */
    async watchOHLCV (symbol: string, timeframe: string = '1m', since: Int = undefined, limit: Int = undefined, params = {}): Promise<OHLCV[]> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const interval = this.safeString (this.timeframes, timeframe, timeframe);
        const topic = market['id'] + '@candle' + '_' + interval;
        const request: Dict = {
            'type': 'subscribe',
            'channelType': 'candle',
            'resolution': interval,
            'symbol': market['id'],
        };
        const message = this.extend (request, params);
        const ohlcv = await this.watchPublic (topic, topic, message);
        if (this.newUpdates) {
            limit = ohlcv.getLimit (market['symbol'], limit);
        }
        return this.filterBySinceLimit (ohlcv, since, limit, 0, true);
    }

    handleOHLCV (client: Client, message) {
        //
        // {
        //     "type": "init",
        //     "channelType": "candle",
        //     "data": {
        //         "symbol": "SOL-PERP",
        //         "resolution": "1",
        //         "ts": 1774000440,
        //         "fillOpen": 88.7234,
        //         "fillHigh": 88.7234,
        //         "fillClose": 88.64,
        //         "fillLow": 88.64,
        //         "oracleOpen": 88.790903,
        //         "oracleHigh": 88.790903,
        //         "oracleClose": 88.745,
        //         "oracleLow": 88.745,
        //         "quoteVolume": 9999.4784,
        //         "baseVolume": 112.81,
        //         "lastTradeTs": 1774000453,
        //         "lastFillRecordId": "16232886"
        //     },
        //     "symbol": "SOL-PERP",
        //     "resolution": "1",
        //     "candle": {
        //         "symbol": "SOL-PERP",
        //         "resolution": "1",
        //         "ts": 1774000440,
        //         "fillOpen": 88.7234,
        //         "fillHigh": 88.7234,
        //         "fillClose": 88.64,
        //         "fillLow": 88.64,
        //         "oracleOpen": 88.790903,
        //         "oracleHigh": 88.790903,
        //         "oracleClose": 88.745,
        //         "oracleLow": 88.745,
        //         "quoteVolume": 9999.4784,
        //         "baseVolume": 112.81,
        //         "lastTradeTs": 1774000453,
        //         "lastFillRecordId": "16232886"
        //     }
        // }
        //
        const data = this.safeDict (message, 'candle', {});
        const marketId = this.safeString (data, 'symbol');
        const market = this.safeMarket (marketId);
        const symbol = market['symbol'];
        const interval = this.safeString (data, 'resolution');
        const timeframe = this.findTimeframe (interval);
        const topic = market['id'] + '@candle' + '_' + interval;
        const parsed = [
            this.safeInteger (data, 'ts'),
            this.safeNumber (data, 'fillOpen'),
            this.safeNumber (data, 'fillHigh'),
            this.safeNumber (data, 'fillLow'),
            this.safeNumber (data, 'fillClose'),
            this.safeNumber (data, 'baseVolume'),
        ];
        this.ohlcvs[symbol] = this.safeValue (this.ohlcvs, symbol, {});
        let stored = this.safeValue (this.ohlcvs[symbol], timeframe);
        if (stored === undefined) {
            const limit = this.safeInteger (this.options, 'OHLCVLimit', 1000);
            stored = new ArrayCacheByTimestamp (limit);
            this.ohlcvs[symbol][timeframe] = stored;
        }
        const ohlcvCache = this.ohlcvs[symbol][timeframe];
        ohlcvCache.append (parsed);
        client.resolve (ohlcvCache, topic);
        // trades data is sent with ohlcv topic
        this.handleTrade (client, message);
    }

    /**
     * @method
     * @name drift#watchOrderBook
     * @description watches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
     * @param {string} symbol unified symbol of the market to fetch the order book for
     * @param {int} [limit] the maximum amount of order book entries to return.
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} A dictionary of [order book structures]{@link https://docs.ccxt.com/?id=order-book-structure} indexed by market symbols
     */
    async watchOrderBook (symbol: string, limit: Int = undefined, params = {}): Promise<OrderBook> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const topic = market['id'] + '@orderbook';
        const request: Dict = {
            'type': 'subscribe',
            'channelType': 'orderbook',
            'symbol': market['id'],
        };
        const message = this.extend (request, params);
        const orderbook = await this.watchPublic (topic, topic, message);
        return orderbook.limit ();
    }

    handleOrderBook (client: Client, message) {
        //
        // {
        //     "type": "update",
        //     "channelType": "orderbook",
        //     "channel": "orderbook:SOL-PERP",
        //     "data": {
        //         "symbol": "SOL-PERP",
        //         "levels": [
        //             [
        //                 [
        //                     "85.560000",
        //                     "2942.366520676"
        //                 ]
        //             ],
        //             [
        //                 [
        //                     "85.716800",
        //                     "2334.774000000"
        //                 ]
        //             ]
        //         ],
        //         "oraclePrice": "85.689988",
        //         "markPrice": "85.638400",
        //         "spreadQuote": "0.156800",
        //         "spreadPercent": "0.183095"
        //     }
        // }
        //
        const data = this.safeDict (message, 'data', {});
        const levels = this.safeList (data, 'levels', []);
        const marketId = this.safeString (data, 'symbol');
        const market = this.safeMarket (marketId);
        const symbol = market['symbol'];
        const topic = this.safeString (message, 'channelType');
        const messageHash = market['id'] + '@' + topic;
        if (!(symbol in this.orderbooks)) {
            this.orderbooks[symbol] = this.orderBook ();
        }
        const orderbook = this.orderbooks[symbol];
        const snapshot = this.parseOrderBook (levels, symbol, undefined, '0', '1', 0, 1);
        orderbook.reset (snapshot);
        client.resolve (orderbook, messageHash);
    }

    /**
     * @method
     * @name drift#watchTrades
     * @description watches information on multiple trades made in a market
     * @param {string} symbol unified market symbol of the market trades were made in
     * @param {int} [since] the earliest time in ms to fetch trades for
     * @param {int} [limit] the maximum number of trade structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of [trade structures]{@link https://docs.ccxt.com/?id=trade-structure}
     */
    async watchTrades (symbol: string, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Trade[]> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const topic = market['id'] + '@candle' + '_1';
        const messageHash = market['id'] + '@trades';
        const request: Dict = {
            'type': 'subscribe',
            'channelType': 'candle',
            'resolution': '1',
            'symbol': market['id'],
        };
        const message = this.extend (request, params);
        const trades = await this.watchPublic (messageHash, topic, message);
        if (this.newUpdates) {
            limit = trades.getLimit (market['symbol'], limit);
        }
        return this.filterBySymbolSinceLimit (trades, symbol, since, limit, true);
    }

    handleTrade (client: Client, message) {
        const trades = this.safeList (message, 'trades', []);
        const limit = this.safeInteger (this.options, 'tradesLimit', 1000);
        for (let i = 0; i < trades.length; i++) {
            const rawTrade = trades[i];
            const marketId = this.safeString (rawTrade, 'symbol');
            const market = this.safeMarket (marketId);
            const symbol = market['symbol'];
            const messageHash = market['id'] + '@trades';
            const trade = this.parseWsTrade (rawTrade, market);
            let tradesArray = this.safeValue (this.trades, symbol);
            if (tradesArray === undefined) {
                tradesArray = new ArrayCache (limit);
            }
            tradesArray.append (trade);
            this.trades[symbol] = tradesArray;
            client.resolve (tradesArray, messageHash);
        }
    }

    parseWsTrade (trade, market = undefined) {
        //
        // {
        //     "symbol": "SOL-PERP",
        //     "fillRecordId": "16251183",
        //     "slot": 408304474,
        //     "actionExplanation": "orderFilledWithMatch",
        //     "makerExistingBaseAssetAmount": null,
        //     "marketType": "perp",
        //     "takerOrderDirection": "long",
        //     "createdAt": 1774260267,
        //     "makerRebate": -0.000017,
        //     "quoteAssetAmountSurplus": 0,
        //     "makerExistingQuoteEntryAmount": null,
        //     "makerFee": -0.000017,
        //     "takerOrderCumulativeQuoteAssetAmountFilled": 0.857168,
        //     "referrerReward": 0,
        //     "action": "fill",
        //     "takerExistingQuoteEntryAmount": 0.859088,
        //     "bitFlags": 0,
        //     "takerOrderId": 2752,
        //     "taker": "ELPPn6XZCanRAT6U9xJZg7wnKuvBtPsRdVff1dcTxesU",
        //     "oraclePrice": 85.781072,
        //     "takerExistingBaseAssetAmount": null,
        //     "quoteAssetAmountFilled": 0.857168,
        //     "makerOrderBaseAssetAmount": 0.5,
        //     "txSigIndex": 0,
        //     "takerFee": 0.000301,
        //     "marketFilter": "perp",
        //     "makerOrderCumulativeQuoteAssetAmountFilled": 0.857168,
        //     "spotFulfillmentMethodFee": 0,
        //     "maker": "3JvYM3FTkPw9AeXMJKmyYgnCtGjKuf9JL46XqhB9aHxe",
        //     "takerOrderBaseAssetAmount": 0.01,
        //     "makerOrderId": 4391,
        //     "makerOrderCumulativeBaseAssetAmountFilled": 0.01,
        //     "takerOrderCumulativeBaseAssetAmountFilled": 0.01,
        //     "baseAssetAmountFilled": 0.01,
        //     "makerOrderDirection": "short",
        //     "txSig": "3br1qBqK17SqSZDgDMMBpe2myWPq2QY2joVqo19WDxAzYNkHS3vzqpNQosQbUfMWKpNw6ZVgtffcbutuGJNfKuS4",
        //     "filler": "JE9m89yHHiCGzzL2FAeeZgHKAFwjkW4Qp1GfjegWnojR",
        //     "marketIndex": 0,
        //     "entity": "market",
        //     "fillerReward": 0.00003,
        //     "ts": 1774260265,
        //     "price": 85.7168
        // }
        //
        const marketId = this.safeString (trade, 'symbol');
        market = this.safeMarket (marketId, market);
        const symbol = market['symbol'];
        const price = this.safeString (trade, 'price');
        const amount = this.safeString (trade, 'baseAssetAmountFilled');
        const timestamp = this.safeInteger (trade, 'ts');
        return this.safeTrade ({
            'id': this.safeString (trade, 'fillRecordId'),
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': symbol,
            'side': undefined,
            'price': price,
            'amount': amount,
            'cost': undefined,
            'order': this.safeString (trade, 'orderId'),
            'takerOrMaker': undefined,
            'type': undefined,
            'fee': {
                'cost': undefined,
                'currency': undefined,
            },
            'info': trade,
        }, market);
    }

    handleErrorMessage (client: Client, message): Bool {
        //
        // {"type":"error","message":"Auth is needed."}
        //
        const type = this.safeString (message, 'type');
        if (type !== 'error') {
            return false;
        }
        const errorMessage = this.safeString (message, 'message');
        try {
            const feedback = this.id + ' ' + this.json (message);
            this.throwExactlyMatchedException (this.exceptions['exact'], errorMessage, feedback);
            return false;
        } catch (error) {
            if (error instanceof AuthenticationError) {
                const messageHash = 'authenticated';
                client.reject (error, messageHash);
                if (messageHash in client.subscriptions) {
                    delete client.subscriptions[messageHash];
                }
            } else {
                client.reject (error);
            }
            return true;
        }
    }

    handleMessage (client: Client, message) {
        if (this.handleErrorMessage (client, message)) {
            return;
        }
        const methods: Dict = {
            'subscribe': this.handleSubscribe,
            'candle': this.handleOHLCV,
            'orderbook': this.handleOrderBook,
        };
        const type = this.safeString (message, 'type');
        if ((type === 'subscribe') || (type === 'subscription')) {
            return this.handleSubscribe (client, message);
        }
        const channelType = this.safeString (message, 'channelType');
        const method = this.safeValue (methods, channelType);
        if (method !== undefined) {
            method.call (this, client, message);
            return;
        }
        if ('candle' in message) {
            this.handleOHLCV (client, message);
        }
    }

    handleSubscribe (client: Client, message) {
        //
        // {
        //     "type": "subscription",
        //     "message": "Subscribed to SOL/USDC:USDC 1",
        //     "channelType": "candle",
        //     "channel": "candle:SOL/USDC:USDC:1",
        //     "symbol": "SOL/USDC:USDC",
        //     "resolution": "1"
        // }
        //
        return message;
    }
}
