// ----------------------------------------------------------------------------

import driftRest from '../drift.js';
import { AuthenticationError, NotSupported } from '../base/errors.js';
import { ArrayCacheByTimestamp, ArrayCacheBySymbolById, ArrayCache, ArrayCacheBySymbolBySide } from '../base/ws/Cache.js';
import { Precise } from '../base/Precise.js';
import { eddsa } from '../base/functions/crypto.js';
import { ed25519 } from '../static_dependencies/noble-curves/ed25519.js';
import type { Int, Str, Strings, OrderBook, Order, Trade, Ticker, Tickers, OHLCV, Balances, Position, Dict, Bool } from '../base/types.js';
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
                'watchTickers': false,
                'watchBidsAsks': false,
                'watchTrades': false,
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

    async watchPublic (messageHash, message) {
        const url = this.urls['api']['ws']['public'];
        return await this.watch (url, messageHash, message, messageHash, message);
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
        const ohlcv = await this.watchPublic (topic, message);
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
        };
        if ('candle' in message) {
            this.handleOHLCV (client, message);
            return;
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
