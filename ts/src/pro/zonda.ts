//  ---------------------------------------------------------------------------

import zondaRest from '../zonda.js';
import Client from '../base/ws/Client.js';
import { ExchangeError } from '../base/errors.js';
import { Dict, Int, OrderBook, Strings, Ticker, Tickers, Trade } from '../base/types.js';
import { ArrayCache } from '../base/ws/Cache.js';

//  ---------------------------------------------------------------------------

export default class zonda extends zondaRest {
    describe () {
        return this.deepExtend (super.describe (), {
            'has': {
                'ws': true,
                'watchOHLCV': false,
                'watchOrderBook': true,
                'watchTicker': true,
                'watchTickers': true,
                'watchTrades': true,
                'watchTradesForSymbols': false,
                'watchBalance': false,
                'watchOrders': false,
                'watchMyTrades': false,
                'watchPositions': false,
            },
            'urls': {
                'api': {
                    'ws': 'wss://api.zondacrypto.exchange/websocket',
                },
            },
            'options': {
                'tradesLimit': 1000,
                'ordersLimit': 1000,
                'OHLCVLimit': 1000,
            },
            'streaming': {
                'keepAlive': 20000,
                'ping': this.ping,
            },
        });
    }

    async watchPublic (topic, messageHash, subscription, params = {}) {
        await this.loadMarkets ();
        const url = this.urls['api']['ws'];
        const request: Dict = {
            'action': 'subscribe-public',
            'module': 'trading',
            'path': topic,
        };
        const message = this.extend (request, params);
        return await this.watch (url, messageHash, message, messageHash, subscription);
    }

    async unWatchPublic (topic, messageHash, params = {}) {
        await this.loadMarkets ();
        const url = this.urls['api']['ws'];
        const request: Dict = {
            'action': 'unsubscribe',
            'module': 'trading',
            'path': topic,
        };
        const message = this.extend (request, params);
        return await this.watch (url, messageHash, message, messageHash);
    }

    async watchTicker (symbol: string, params = {}): Promise<Ticker> {
        /**
         * @method
         * @name zonda#watchTicker
         * @description watches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
         * @see https://docs.zondacrypto.exchange/reference/ticker-2
         * @param {string} symbol unified symbol of the market to fetch the ticker for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        symbol = market['symbol'];
        const topic = 'ticker/' + market['id'];
        const messageHash = 'ticker:' + symbol;
        return await this.watchPublic (topic, messageHash, undefined, params);
    }

    async unWatchTicker (symbol: string, params = {}): Promise<any> {
        /**
         * @method
         * @name zonda#unWatchTicker
         * @description unWatches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
         * @see https://docs.zondacrypto.exchange/reference/ticker-2
         * @param {string} symbol unified symbol of the market to fetch the ticker for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {string} [params.channel] the channel to subscribe to, tickers by default. Can be tickers, sprd-tickers, index-tickers, block-tickers
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        symbol = market['symbol'];
        const topic = 'ticker/' + market['id'];
        const messageHash = 'ticker:' + symbol;
        return await this.unWatchPublic (topic, messageHash, params);
    }

    async watchTickers (symbols: Strings = undefined, params = {}): Promise<Tickers> {
        /**
         * @method
         * @name zonda#watchTickers
         * @description watches a price ticker, a statistical calculation with the information calculated over the past 24 hours for all markets of a specific list
         * @see https://docs.zondacrypto.exchange/reference/ticker-2
         * @param {string[]} [symbols] unified symbol of the market to fetch the ticker for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets ();
        symbols = this.marketSymbols (symbols);
        const topic = 'ticker';
        const messageHash = 'ticker';
        await this.watchPublic (topic, messageHash, undefined, params);
        return this.filterByArray (this.tickers, 'symbol', symbols);
    }

    async unWatchTickers (symbols: Strings = undefined, params = {}): Promise<any> {
        /**
         * @method
         * @name zonda#unWatchTickers
         * @description unWatches a price ticker, a statistical calculation with the information calculated over the past 24 hours for all markets of a specific list
         * @see https://docs.zondacrypto.exchange/reference/ticker-2
         * @param {string[]} [symbols] unified symbol of the market to fetch the ticker for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets ();
        symbols = this.marketSymbols (symbols);
        const topic = 'ticker';
        const messageHash = 'ticker';
        return await this.unWatchPublic (topic, messageHash, params);
    }

    handleTicker (client: Client, message) {
        //
        // {
        //     "action": "push",
        //     "topic": "trading/ticker/sol-usdc",
        //     "message": {
        //         "market": {
        //             "code": "SOL-USDC",
        //             "first": {
        //                 "currency": "SOL",
        //                 "minOffer": "0.0021",
        //                 "scale": 8
        //             },
        //             "second": {
        //                 "currency": "USDC",
        //                 "minOffer": "0.441",
        //                 "scale": 6
        //             },
        //             "amountPrecision": 8,
        //             "pricePrecision": 6,
        //             "ratePrecision": 6
        //         },
        //         "time": "1731567778864",
        //         "highestBid": "215.818309",
        //         "lowestAsk": "217.545891",
        //         "rate": "210.925539",
        //         "previousRate": "214.93681"
        //     },
        //     "timestamp": "1731567778864",
        //     "seqNo": 11144256
        // }
        //
        const data = this.safeDict (message, 'message', {});
        const parsedTicker = this.parseTicker (data);
        const symbol = parsedTicker['symbol'];
        this.tickers[symbol] = parsedTicker;
        const topic = 'ticker';
        client.resolve (parsedTicker, topic);
        const messageHash = topic + ':' + symbol;
        client.resolve (parsedTicker, messageHash);
    }

    async watchOrderBook (symbol: string, limit: Int = undefined, params = {}): Promise<OrderBook> {
        /**
         * @method
         * @name zonda#watchOrderBook
         * @description watches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
         * @see https://docs.zondacrypto.exchange/reference/orderbook-3
         * @param {string} symbol unified symbol of the market to fetch the order book for
         * @param {int} [limit] the maximum amount of order book entries to return
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} A dictionary of [order book structures]{@link https://docs.ccxt.com/#/?id=order-book-structure} indexed by market symbols
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        symbol = market['symbol'];
        const topic = 'orderbook/' + market['id'].toLowerCase ();
        const subscription: Dict = {
            'topic': topic,
            'method': this.handleOrderBookSubscription,
            'symbol': symbol,
            'limit': limit,
            'params': params,
        };
        const orderbook = await this.watchPublic (topic, topic, subscription, params);
        return orderbook.limit ();
    }

    handleOrderBook (client: Client, message) {
        //
        // {
        //     "action": "push",
        //     "topic": "trading/orderbook/btc-pln",
        //     "message": {
        //       "changes": [
        //         {
        //           "marketCode": "BTC-PLN",
        //           "entryType": "Buy",
        //           "rate": "27601.35",
        //           "action": "update",
        //           "state": {
        //             "ra": "27601.35",
        //             "ca": "0.46205049",
        //             "sa": "0.46205049",
        //             "pa": "0.46205049",
        //             "co": 4
        //           }
        //         }
        //       ],
        //       "timestamp": "1576847016253"
        //     },
        //     "timestamp": "1576847016253",
        //     "seqNo": 40018807
        // }
        //
        const data = this.safeDict (message, 'message', {});
        const updates = this.safeList (data, 'changes', []);
        const first = this.safeDict (updates, 0);
        const marketId = this.safeString (first, 'marketCode');
        const market = this.market (marketId);
        const messageHash = 'orderbook/' + market['id'].toLowerCase ();
        const symbol = market['symbol'];
        if (!(symbol in this.orderbooks)) {
            return;
        }
        const orderbook = this.orderbooks[symbol];
        const timestamp = this.safeInteger (orderbook, 'timestamp');
        if (timestamp === undefined) {
            orderbook.cache.push (message);
        } else {
            try {
                const ts = this.safeInteger (data, 'timestamp');
                if (ts > timestamp) {
                    this.handleOrderBookMessage (client, message, orderbook);
                    client.resolve (orderbook, messageHash);
                }
            } catch (e) {
                delete this.orderbooks[symbol];
                delete client.subscriptions[messageHash];
                client.reject (e, messageHash);
            }
        }
    }

    handleOrderBookSubscription (client: Client, message, subscription) {
        const defaultLimit = this.safeInteger (this.options, 'watchOrderBookLimit', 1000);
        const limit = this.safeInteger (subscription, 'limit', defaultLimit);
        const symbol = this.safeString (subscription, 'symbol'); // watchOrderBook
        if (symbol in this.orderbooks) {
            delete this.orderbooks[symbol];
        }
        this.orderbooks[symbol] = this.orderBook ({}, limit);
        this.spawn (this.fetchOrderBookSnapshot, client, message, subscription);
    }

    async fetchOrderBookSnapshot (client, message, subscription) {
        const symbol = this.safeString (subscription, 'symbol');
        const messageHash = this.safeString (message, 'path');
        try {
            const defaultLimit = this.safeInteger (this.options, 'watchOrderBookLimit', 1000);
            const limit = this.safeInteger (subscription, 'limit', defaultLimit);
            const params = this.safeValue (subscription, 'params');
            const snapshot = await this.fetchRestOrderBookSafe (symbol, limit, params);
            if (this.safeValue (this.orderbooks, symbol) === undefined) {
                // if the orderbook is dropped before the snapshot is received
                return;
            }
            const orderbook = this.orderbooks[symbol];
            orderbook.reset (snapshot);
            const messages = orderbook.cache;
            for (let i = 0; i < messages.length; i++) {
                const messageItem = messages[i];
                const ts = this.safeInteger (messageItem, 'ts');
                if (ts < orderbook['timestamp']) {
                    continue;
                } else {
                    this.handleOrderBookMessage (client, messageItem, orderbook);
                }
            }
            this.orderbooks[symbol] = orderbook;
            client.resolve (orderbook, messageHash);
        } catch (e) {
            delete client.subscriptions[messageHash];
            client.reject (e, messageHash);
        }
    }

    handleOrderBookMessage (client: Client, message, orderbook) {
        const data = this.safeDict (message, 'message');
        const updates = this.safeList (data, 'changes', []);
        const rawBids = [];
        const rawAsks = [];
        for (let i = 0; i < updates.length; i++) {
            const update = updates[i];
            const type = this.safeStringLower (update, 'entryType');
            const raw = this.safeDict (update, 'state', {});
            if (type === 'sell') {
                rawAsks.push (raw);
            } else {
                rawBids.push (raw);
            }
        }
        this.handleDeltas (orderbook['asks'], this.parseBidsAsks (rawAsks, 'ra', 'ca'));
        this.handleDeltas (orderbook['bids'], this.parseBidsAsks (rawBids, 'ra', 'ca'));
        const timestamp = this.safeInteger (data, 'timestamp');
        orderbook['timestamp'] = timestamp;
        orderbook['datetime'] = this.iso8601 (timestamp);
        return orderbook;
    }

    handleDelta (bookside, delta) {
        const price = this.safeFloat (delta, 0);
        const amount = this.safeFloat (delta, 1);
        bookside.store (price, amount);
    }

    handleDeltas (bookside, deltas) {
        for (let i = 0; i < deltas.length; i++) {
            this.handleDelta (bookside, deltas[i]);
        }
    }

    async watchTrades (symbol: string, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Trade[]> {
        /**
         * @method
         * @name zonda#watchTrades
         * @description watches information on multiple trades made in a market
         * @see https://docs.zondacrypto.exchange/reference/last-transactions-ws
         * @param {string} symbol unified symbol of the market to fetch the ticker for
         * @param {int} [since] the earliest time in ms to fetch trades for
         * @param {int} [limit] the maximum number of trade structures to retrieve
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        symbol = market['symbol'];
        const topic = 'transactions/' + market['id'];
        const messageHash = 'trade:' + symbol;
        const trades = await this.watchPublic (topic, messageHash, undefined, params);
        if (this.newUpdates) {
            limit = trades.getLimit (market['symbol'], limit);
        }
        return this.filterBySymbolSinceLimit (trades, symbol, since, limit, true);
    }

    handleTrades (client: Client, message) {
        //
        // {
        //     "action": "push",
        //     "topic": "trading/transactions/btc-pln",
        //     "message": {
        //         "transactions": [
        //             {
        //                 "id": "e211a107-a7b5-11ef-86d5-0242ac110005",
        //                 "t": "1732158509549",
        //                 "a": "0.00025710",
        //                 "r": "389100",
        //                 "ty": "Buy"
        //             }
        //         ]
        //     },
        //     "timestamp": "1732158509549",
        //     "seqNo": 7184609
        // }
        //
        const topic = this.safeString (message, 'topic');
        const part = topic.split ('/');
        const marketId = this.safeStringUpper (part, 2);
        const market = this.market (marketId);
        const symbol = market['symbol'];
        const data = this.safeDict (message, 'message', {});
        const trades = this.safeList (data, 'transactions', []);
        let stored = this.safeValue (this.trades, symbol);
        if (stored === undefined) {
            const limit = this.safeInteger (this.options, 'tradesLimit', 1000);
            stored = new ArrayCache (limit);
            this.trades[symbol] = stored;
        }
        for (let i = 0; i < trades.length; i++) {
            const parsedTrade = this.parseTrade (trades[i], market);
            stored.append (parsedTrade);
        }
        const messageHash = 'trade:' + symbol;
        client.resolve (stored, messageHash);
    }

    ping (client: Client) {
        return {
            'action': 'ping',
        };
    }

    handlePong (client: Client, message) {
        //
        // {
        //     'action': 'pong',
        // }
        //
        client.lastPong = this.milliseconds ();
        return message;
    }

    handleSubscribe (client: Client, message) {
        //
        // {
        //     "action": "subscribe-public-confirm",
        //     "module": "trading",
        //     "path": "orderbook/SOL-USDC"
        // }
        //
        const topic = this.safeString (message, 'path');
        const part = topic.split ('/');
        if (this.safeString (part, 0) === 'orderbook') {
            const subscriptionsById = this.indexBy (client.subscriptions, 'topic');
            const subscription = this.safeValue (subscriptionsById, topic, {});
            const method = this.safeValue (subscription, 'method');
            if (method !== undefined) {
                method.call (this, client, message, subscription);
            }
            return message;
        }
    }

    handleMessage (client: Client, message) {
        const error = this.safeString (message, 'error');
        if (error !== undefined) {
            throw new ExchangeError (this.id + ' ' + error);
        }
        const action = this.safeString (message, 'action');
        if (action === 'pong') {
            this.handlePong (client, message);
            return;
        }
        if (action === 'subscribe-public-confirm') {
            this.handleSubscribe (client, message);
            return;
        }
        const topic = this.safeString (message, 'topic');
        if (topic !== undefined) {
            const part = topic.split ('/');
            const channels = this.safeString (part, 1);
            const methods: Dict = {
                'ticker': this.handleTicker,
                'orderbook': this.handleOrderBook,
                'transactions': this.handleTrades,
            };
            const exacMethod = this.safeValue (methods, channels);
            if (exacMethod !== undefined) {
                exacMethod.call (this, client, message);
            }
        }
    }
}
