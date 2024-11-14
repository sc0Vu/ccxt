//  ---------------------------------------------------------------------------

import zondaRest from '../zonda.js';
import Client from '../base/ws/Client.js';
import { ExchangeError } from '../base/errors.js';
import { Dict, Strings, Ticker, Tickers } from '../base/types.js';

//  ---------------------------------------------------------------------------

export default class zonda extends zondaRest {
    describe () {
        return this.deepExtend (super.describe (), {
            'has': {
                'ws': true,
                'watchOHLCV': false,
                'watchOrderBook': false,
                'watchTicker': true,
                'watchTickers': true,
                'watchTrades': false,
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

    async watchPublic (topic, messageHash, params = {}) {
        await this.loadMarkets ();
        const url = this.urls['api']['ws'];
        const request: Dict = {
            'action': 'subscribe-public',
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
        return await this.watchPublic (topic, messageHash, params);
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
        await this.watchPublic (topic, messageHash, params);
        return this.filterByArray (this.tickers, 'symbol', symbols);
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
        const topic = this.safeString (message, 'topic');
        if (topic !== undefined) {
            const part = topic.split ('/');
            const channels = this.safeString (part, 1);
            const methods: Dict = {
                'ticker': this.handleTicker,
            };
            const exacMethod = this.safeValue (methods, channels);
            if (exacMethod !== undefined) {
                exacMethod.call (this, client, message);
            }
        }
    }
}
