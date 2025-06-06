
//  ---------------------------------------------------------------------------

import Exchange from './abstract/bitflyer.js';
import { ExchangeError, ArgumentsRequired, OrderNotFound, OnMaintenance } from './base/errors.js';
import { TICK_SIZE } from './base/functions/number.js';
import { sha256 } from './static_dependencies/noble-hashes/sha256.js';
import type { Balances, Currency, Dict, FundingRate, Int, Market, MarketInterface, Num, Order, OrderBook, OrderSide, OrderType, Str, Strings, Ticker, Trade, TradingFeeInterface, Transaction, Position, int } from './base/types.js';
import { Precise } from './base/Precise.js';

//  ---------------------------------------------------------------------------

/**
 * @class bitflyer
 * @augments Exchange
 */
export default class bitflyer extends Exchange {
    describe (): any {
        return this.deepExtend (super.describe (), {
            'id': 'bitflyer',
            'name': 'bitFlyer',
            'countries': [ 'JP' ],
            'version': 'v1',
            'rateLimit': 1000, // their nonce-timestamp is in seconds...
            'hostname': 'bitflyer.com', // or bitflyer.com
            'has': {
                'CORS': undefined,
                'spot': true,
                'margin': false,
                'swap': undefined, // has but not fully implemented
                'future': undefined, // has but not fully implemented
                'option': false,
                'cancelAllOrders': undefined,  // https://lightning.bitflyer.com/docs?lang=en#cancel-all-orders
                'cancelOrder': true,
                'createOrder': true,
                'fetchBalance': true,
                'fetchClosedOrders': 'emulated',
                'fetchDeposits': true,
                'fetchFundingRate': true,
                'fetchFundingRateHistory': false,
                'fetchFundingRates': false,
                'fetchMarginMode': false,
                'fetchMarkets': true,
                'fetchMyTrades': true,
                'fetchOpenOrders': 'emulated',
                'fetchOrder': 'emulated',
                'fetchOrderBook': true,
                'fetchOrders': true,
                'fetchPositionMode': false,
                'fetchPositions': true,
                'fetchTicker': true,
                'fetchTrades': true,
                'fetchTradingFee': true,
                'fetchTradingFees': false,
                'fetchTransfer': false,
                'fetchTransfers': false,
                'fetchWithdrawals': true,
                'transfer': false,
                'withdraw': true,
            },
            'urls': {
                'logo': 'https://github.com/user-attachments/assets/d0217747-e54d-4533-8416-0d553dca74bb',
                'api': {
                    'rest': 'https://api.{hostname}',
                },
                'www': 'https://bitflyer.com',
                'doc': 'https://lightning.bitflyer.com/docs?lang=en',
            },
            'api': {
                'public': {
                    'get': [
                        'getmarkets/usa', // new (wip)
                        'getmarkets/eu',  // new (wip)
                        'getmarkets',     // or 'markets'
                        'getboard',       // ...
                        'getticker',
                        'getexecutions',
                        'gethealth',
                        'getboardstate',
                        'getchats',
                        'getfundingrate',
                    ],
                },
                'private': {
                    'get': [
                        'getpermissions',
                        'getbalance',
                        'getbalancehistory',
                        'getcollateral',
                        'getcollateralhistory',
                        'getcollateralaccounts',
                        'getaddresses',
                        'getcoinins',
                        'getcoinouts',
                        'getbankaccounts',
                        'getdeposits',
                        'getwithdrawals',
                        'getchildorders',
                        'getparentorders',
                        'getparentorder',
                        'getexecutions',
                        'getpositions',
                        'gettradingcommission',
                    ],
                    'post': [
                        'sendcoin',
                        'withdraw',
                        'sendchildorder',
                        'cancelchildorder',
                        'sendparentorder',
                        'cancelparentorder',
                        'cancelallchildorders',
                    ],
                },
            },
            'fees': {
                'trading': {
                    'maker': this.parseNumber ('0.002'),
                    'taker': this.parseNumber ('0.002'),
                },
            },
            'precisionMode': TICK_SIZE,
            'features': {
                'spot': {
                    'sandbox': false,
                    'createOrder': {
                        'marginMode': false,
                        'triggerPrice': false,
                        'triggerPriceType': undefined,
                        'triggerDirection': false,
                        'stopLossPrice': false,
                        'takeProfitPrice': false,
                        'attachedStopLossTakeProfit': undefined,
                        'timeInForce': {
                            'IOC': true,
                            'FOK': true,
                            'PO': true,
                            'GTD': true, // todo implement
                        },
                        'hedged': false,
                        'trailing': false, // todo recheck
                        'leverage': false,
                        'marketBuyRequiresPrice': false,
                        'marketBuyByCost': false,
                        'selfTradePrevention': false,
                        'iceberg': false,
                    },
                    'createOrders': undefined,
                    'fetchMyTrades': {
                        'marginMode': false,
                        'limit': 100,
                        'daysBack': undefined,
                        'untilDays': undefined,
                        'symbolRequired': true,
                    },
                    'fetchOrder': {
                        'marginMode': false,
                        'trigger': false,
                        'trailing': false,
                        'symbolRequired': true,
                    },
                    'fetchOpenOrders': {
                        'marginMode': false,
                        'limit': 100,
                        'trigger': false,
                        'trailing': false,
                        'symbolRequired': true,
                    },
                    'fetchOrders': {
                        'marginMode': false,
                        'limit': 100,
                        'daysBack': undefined,
                        'untilDays': undefined,
                        'trigger': false,
                        'trailing': false,
                        'symbolRequired': true,
                    },
                    'fetchClosedOrders': {
                        'marginMode': false,
                        'limit': 100,
                        'daysBack': undefined,
                        'daysBackCanceled': undefined,
                        'untilDays': undefined,
                        'trigger': false,
                        'trailing': false,
                        'symbolRequired': true,
                    },
                    'fetchOHLCV': undefined,
                },
                'swap': {
                    'linear': undefined,
                    'inverse': undefined,
                },
                'future': {
                    'linear': undefined,
                    'inverse': undefined,
                },
            },
            'exceptions': {
                'exact': {
                    '-2': OnMaintenance, // {"status":-2,"error_message":"Under maintenance","data":null}
                },
            },
        });
    }

    parseExpiryDate (expiry) {
        const day = expiry.slice (0, 2);
        const monthName = expiry.slice (2, 5);
        const year = expiry.slice (5, 9);
        const months: Dict = {
            'JAN': '01',
            'FEB': '02',
            'MAR': '03',
            'APR': '04',
            'MAY': '05',
            'JUN': '06',
            'JUL': '07',
            'AUG': '08',
            'SEP': '09',
            'OCT': '10',
            'NOV': '11',
            'DEC': '12',
        };
        const month = this.safeString (months, monthName);
        return this.parse8601 (year + '-' + month + '-' + day + 'T00:00:00Z');
    }

    safeMarket (marketId: Str = undefined, market: Market = undefined, delimiter: Str = undefined, marketType: Str = undefined): MarketInterface {
        // Bitflyer has a different type of conflict in markets, because
        // some of their ids (ETH/BTC and BTC/JPY) are duplicated in US, EU and JP.
        // Since they're the same we just need to return one
        return super.safeMarket (marketId, market, delimiter, 'spot');
    }

    /**
     * @method
     * @name bitflyer#fetchMarkets
     * @description retrieves data on all markets for bitflyer
     * @see https://lightning.bitflyer.com/docs?lang=en#market-list
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} an array of objects representing market data
     */
    async fetchMarkets (params = {}): Promise<Market[]> {
        const jp_markets = await this.publicGetGetmarkets (params);
        //
        //     [
        //         // spot
        //         { "product_code": "BTC_JPY", "market_type": "Spot" },
        //         { "product_code": "BCH_BTC", "market_type": "Spot" },
        //         // forex swap
        //         { "product_code": "FX_BTC_JPY", "market_type": "FX" },
        //
        //         // future
        //         {
        //             "product_code": "BTCJPY11FEB2022",
        //             "alias": "BTCJPY_MAT1WK",
        //             "market_type": "Futures",
        //         },
        //     ];
        //
        const us_markets = await this.publicGetGetmarketsUsa (params);
        //
        //     [
        //         { "product_code": "BTC_USD", "market_type": "Spot" },
        //         { "product_code": "BTC_JPY", "market_type": "Spot" },
        //     ];
        //
        const eu_markets = await this.publicGetGetmarketsEu (params);
        //
        //     [
        //         { "product_code": "BTC_EUR", "market_type": "Spot" },
        //         { "product_code": "BTC_JPY", "market_type": "Spot" },
        //     ];
        //
        let markets = this.arrayConcat (jp_markets, us_markets);
        markets = this.arrayConcat (markets, eu_markets);
        const result = [];
        for (let i = 0; i < markets.length; i++) {
            const market = markets[i];
            const id = this.safeString (market, 'product_code');
            const currencies = id.split ('_');
            const marketType = this.safeString (market, 'market_type');
            const swap = (marketType === 'FX');
            const future = (marketType === 'Futures');
            const spot = !swap && !future;
            let type = 'spot';
            let settle = undefined;
            let baseId = undefined;
            let quoteId = undefined;
            let expiry = undefined;
            if (spot) {
                baseId = this.safeString (currencies, 0);
                quoteId = this.safeString (currencies, 1);
            } else if (swap) {
                type = 'swap';
                baseId = this.safeString (currencies, 1);
                quoteId = this.safeString (currencies, 2);
            } else if (future) {
                const alias = this.safeString (market, 'alias');
                if (alias === undefined) {
                    // no alias:
                    // { product_code: 'BTCJPY11MAR2022', market_type: 'Futures' }
                    // TODO this will break if there are products with 4 chars
                    baseId = id.slice (0, 3);
                    quoteId = id.slice (3, 6);
                    // last 9 chars are expiry date
                    const expiryDate = id.slice (-9);
                    expiry = this.parseExpiryDate (expiryDate);
                } else {
                    const splitAlias = alias.split ('_');
                    const currencyIds = this.safeString (splitAlias, 0);
                    baseId = currencyIds.slice (0, -3);
                    quoteId = currencyIds.slice (-3);
                    const splitId = id.split (currencyIds);
                    const expiryDate = this.safeString (splitId, 1);
                    expiry = this.parseExpiryDate (expiryDate);
                }
                type = 'future';
            }
            const base = this.safeCurrencyCode (baseId);
            const quote = this.safeCurrencyCode (quoteId);
            let symbol = base + '/' + quote;
            let taker = this.fees['trading']['taker'];
            let maker = this.fees['trading']['maker'];
            const contract = swap || future;
            if (contract) {
                maker = 0.0;
                taker = 0.0;
                settle = 'JPY';
                symbol = symbol + ':' + settle;
                if (future) {
                    symbol = symbol + '-' + this.yymmdd (expiry);
                }
            }
            result.push ({
                'id': id,
                'symbol': symbol,
                'base': base,
                'quote': quote,
                'settle': settle,
                'baseId': baseId,
                'quoteId': quoteId,
                'settleId': undefined,
                'type': type,
                'spot': spot,
                'margin': false,
                'swap': swap,
                'future': future,
                'option': false,
                'active': true,
                'contract': contract,
                'linear': spot ? undefined : true,
                'inverse': spot ? undefined : false,
                'taker': taker,
                'maker': maker,
                'contractSize': undefined,
                'expiry': expiry,
                'expiryDatetime': this.iso8601 (expiry),
                'strike': undefined,
                'optionType': undefined,
                'precision': {
                    'amount': undefined,
                    'price': undefined,
                },
                'limits': {
                    'leverage': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'amount': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'price': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'cost': {
                        'min': undefined,
                        'max': undefined,
                    },
                },
                'created': undefined,
                'info': market,
            });
        }
        return result;
    }

    parseBalance (response): Balances {
        const result: Dict = { 'info': response };
        for (let i = 0; i < response.length; i++) {
            const balance = response[i];
            const currencyId = this.safeString (balance, 'currency_code');
            const code = this.safeCurrencyCode (currencyId);
            const account = this.account ();
            account['total'] = this.safeString (balance, 'amount');
            account['free'] = this.safeString (balance, 'available');
            result[code] = account;
        }
        return this.safeBalance (result);
    }

    /**
     * @method
     * @name bitflyer#fetchBalance
     * @description query for balance and get the amount of funds available for trading or funds locked in orders
     * @see https://lightning.bitflyer.com/docs?lang=en#get-account-asset-balance
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [balance structure]{@link https://docs.ccxt.com/#/?id=balance-structure}
     */
    async fetchBalance (params = {}): Promise<Balances> {
        await this.loadMarkets ();
        const response = await this.privateGetGetbalance (params);
        //
        //     [
        //         {
        //             "currency_code": "JPY",
        //             "amount": 1024078,
        //             "available": 508000
        //         },
        //         {
        //             "currency_code": "BTC",
        //             "amount": 10.24,
        //             "available": 4.12
        //         },
        //         {
        //             "currency_code": "ETH",
        //             "amount": 20.48,
        //             "available": 16.38
        //         }
        //     ]
        //
        return this.parseBalance (response);
    }

    /**
     * @method
     * @name bitflyer#fetchOrderBook
     * @description fetches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
     * @see https://lightning.bitflyer.com/docs?lang=en#order-book
     * @param {string} symbol unified symbol of the market to fetch the order book for
     * @param {int} [limit] the maximum amount of order book entries to return
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} A dictionary of [order book structures]{@link https://docs.ccxt.com/#/?id=order-book-structure} indexed by market symbols
     */
    async fetchOrderBook (symbol: string, limit: Int = undefined, params = {}): Promise<OrderBook> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'product_code': market['id'],
        };
        const orderbook = await this.publicGetGetboard (this.extend (request, params));
        return this.parseOrderBook (orderbook, market['symbol'], undefined, 'bids', 'asks', 'price', 'size');
    }

    parseTicker (ticker: Dict, market: Market = undefined): Ticker {
        const symbol = this.safeSymbol (undefined, market);
        const timestamp = this.parse8601 (this.safeString (ticker, 'timestamp'));
        const last = this.safeString (ticker, 'ltp');
        return this.safeTicker ({
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'high': undefined,
            'low': undefined,
            'bid': this.safeString (ticker, 'best_bid'),
            'bidVolume': undefined,
            'ask': this.safeString (ticker, 'best_ask'),
            'askVolume': undefined,
            'vwap': undefined,
            'open': undefined,
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': this.safeString (ticker, 'volume_by_product'),
            'quoteVolume': undefined,
            'info': ticker,
        }, market);
    }

    /**
     * @method
     * @name bitflyer#fetchTicker
     * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
     * @see https://lightning.bitflyer.com/docs?lang=en#ticker
     * @param {string} symbol unified symbol of the market to fetch the ticker for
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
     */
    async fetchTicker (symbol: string, params = {}): Promise<Ticker> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'product_code': market['id'],
        };
        const response = await this.publicGetGetticker (this.extend (request, params));
        return this.parseTicker (response, market);
    }

    parseTrade (trade: Dict, market: Market = undefined): Trade {
        //
        // fetchTrades (public) v1
        //
        //      {
        //          "id":2278466664,
        //          "side":"SELL",
        //          "price":56810.7,
        //          "size":0.08798,
        //          "exec_date":"2021-11-19T11:46:39.323",
        //          "buy_child_order_acceptance_id":"JRF20211119-114209-236525",
        //          "sell_child_order_acceptance_id":"JRF20211119-114639-236919"
        //      }
        //
        // fetchMyTrades
        //
        //      {
        //          "id": 37233,
        //          "side": "BUY",
        //          "price": 33470,
        //          "size": 0.01,
        //          "exec_date": "2015-07-07T09:57:40.397",
        //          "child_order_id": "JOR20150707-060559-021935",
        //          "child_order_acceptance_id": "JRF20150707-060559-396699"
        //          "commission": 0,
        //      },
        //
        let side = this.safeStringLower (trade, 'side');
        if (side !== undefined) {
            if (side.length < 1) {
                side = undefined;
            }
        }
        let order = undefined;
        if (side !== undefined) {
            const idInner = side + '_child_order_acceptance_id';
            if (idInner in trade) {
                order = trade[idInner];
            }
        }
        if (order === undefined) {
            order = this.safeString (trade, 'child_order_acceptance_id');
        }
        const timestamp = this.parse8601 (this.safeString (trade, 'exec_date'));
        const priceString = this.safeString (trade, 'price');
        const amountString = this.safeString (trade, 'size');
        const id = this.safeString (trade, 'id');
        market = this.safeMarket (undefined, market);
        return this.safeTrade ({
            'id': id,
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': market['symbol'],
            'order': order,
            'type': undefined,
            'side': side,
            'takerOrMaker': undefined,
            'price': priceString,
            'amount': amountString,
            'cost': undefined,
            'fee': undefined,
        }, market);
    }

    /**
     * @method
     * @name bitflyer#fetchTrades
     * @description get the list of most recent trades for a particular symbol
     * @see https://lightning.bitflyer.com/docs?lang=en#list-executions
     * @param {string} symbol unified symbol of the market to fetch trades for
     * @param {int} [since] timestamp in ms of the earliest trade to fetch
     * @param {int} [limit] the maximum amount of trades to fetch
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=public-trades}
     */
    async fetchTrades (symbol: string, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Trade[]> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'product_code': market['id'],
        };
        if (limit !== undefined) {
            request['count'] = limit;
        }
        const response = await this.publicGetGetexecutions (this.extend (request, params));
        //
        //    [
        //     {
        //       "id": 39287,
        //       "side": "BUY",
        //       "price": 31690,
        //       "size": 27.04,
        //       "exec_date": "2015-07-08T02:43:34.823",
        //       "buy_child_order_acceptance_id": "JRF20150707-200203-452209",
        //       "sell_child_order_acceptance_id": "JRF20150708-024334-060234"
        //     },
        //    ]
        //
        return this.parseTrades (response, market, since, limit);
    }

    /**
     * @method
     * @name bitflyer#fetchTradingFee
     * @description fetch the trading fees for a market
     * @see https://lightning.bitflyer.com/docs?lang=en#get-trading-commission
     * @param {string} symbol unified market symbol
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [fee structure]{@link https://docs.ccxt.com/#/?id=fee-structure}
     */
    async fetchTradingFee (symbol: string, params = {}): Promise<TradingFeeInterface> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'product_code': market['id'],
        };
        const response = await this.privateGetGettradingcommission (this.extend (request, params));
        //
        //   {
        //       commission_rate: '0.0020'
        //   }
        //
        const fee = this.safeNumber (response, 'commission_rate');
        return {
            'info': response,
            'symbol': market['symbol'],
            'maker': fee,
            'taker': fee,
            'percentage': undefined,
            'tierBased': undefined,
        };
    }

    /**
     * @method
     * @name bitflyer#createOrder
     * @description create a trade order
     * @see https://lightning.bitflyer.com/docs?lang=en#send-a-new-order
     * @param {string} symbol unified symbol of the market to create an order in
     * @param {string} type 'market' or 'limit'
     * @param {string} side 'buy' or 'sell'
     * @param {float} amount how much of currency you want to trade in units of base currency
     * @param {float} [price] the price at which the order is to be fulfilled, in units of the quote currency, ignored in market orders
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async createOrder (symbol: string, type: OrderType, side: OrderSide, amount: number, price: Num = undefined, params = {}) {
        await this.loadMarkets ();
        const request: Dict = {
            'product_code': this.marketId (symbol),
            'child_order_type': type.toUpperCase (),
            'side': side.toUpperCase (),
            'price': price,
            'size': amount,
        };
        const result = await this.privatePostSendchildorder (this.extend (request, params));
        // { "status": - 200, "error_message": "Insufficient funds", "data": null }
        const id = this.safeString (result, 'child_order_acceptance_id');
        return this.safeOrder ({
            'id': id,
            'info': result,
        });
    }

    /**
     * @method
     * @name bitflyer#cancelOrder
     * @description cancels an open order
     * @see https://lightning.bitflyer.com/docs?lang=en#cancel-order
     * @param {string} id order id
     * @param {string} symbol unified symbol of the market the order was made in
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async cancelOrder (id: string, symbol: Str = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' cancelOrder() requires a symbol argument');
        }
        await this.loadMarkets ();
        const request: Dict = {
            'product_code': this.marketId (symbol),
            'child_order_acceptance_id': id,
        };
        const response = await this.privatePostCancelchildorder (this.extend (request, params));
        //
        //    200 OK.
        //
        return this.safeOrder ({
            'info': response,
        });
    }

    parseOrderStatus (status: Str) {
        const statuses: Dict = {
            'ACTIVE': 'open',
            'COMPLETED': 'closed',
            'CANCELED': 'canceled',
            'EXPIRED': 'canceled',
            'REJECTED': 'canceled',
        };
        return this.safeString (statuses, status, status);
    }

    parseOrder (order: Dict, market: Market = undefined): Order {
        const timestamp = this.parse8601 (this.safeString (order, 'child_order_date'));
        const price = this.safeString (order, 'price');
        const amount = this.safeString (order, 'size');
        const filled = this.safeString (order, 'executed_size');
        const remaining = this.safeString (order, 'outstanding_size');
        const status = this.parseOrderStatus (this.safeString (order, 'child_order_state'));
        const type = this.safeStringLower (order, 'child_order_type');
        const side = this.safeStringLower (order, 'side');
        const marketId = this.safeString (order, 'product_code');
        const symbol = this.safeSymbol (marketId, market);
        let fee = undefined;
        const feeCost = this.safeNumber (order, 'total_commission');
        if (feeCost !== undefined) {
            fee = {
                'cost': feeCost,
                'currency': undefined,
                'rate': undefined,
            };
        }
        const id = this.safeString (order, 'child_order_acceptance_id');
        return this.safeOrder ({
            'id': id,
            'clientOrderId': undefined,
            'info': order,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'lastTradeTimestamp': undefined,
            'status': status,
            'symbol': symbol,
            'type': type,
            'timeInForce': undefined,
            'postOnly': undefined,
            'side': side,
            'price': price,
            'triggerPrice': undefined,
            'cost': undefined,
            'amount': amount,
            'filled': filled,
            'remaining': remaining,
            'fee': fee,
            'average': undefined,
            'trades': undefined,
        }, market);
    }

    /**
     * @method
     * @name bitflyer#fetchOrders
     * @description fetches information on multiple orders made by the user
     * @see https://lightning.bitflyer.com/docs?lang=en#list-orders
     * @param {string} symbol unified market symbol of the market orders were made in
     * @param {int} [since] the earliest time in ms to fetch orders for
     * @param {int} [limit] the maximum number of order structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = 100, params = {}): Promise<Order[]> {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchOrders() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'product_code': market['id'],
            'count': limit,
        };
        const response = await this.privateGetGetchildorders (this.extend (request, params));
        let orders = this.parseOrders (response, market, since, limit);
        if (symbol !== undefined) {
            orders = this.filterBy (orders, 'symbol', symbol) as Order[];
        }
        return orders;
    }

    /**
     * @method
     * @name bitflyer#fetchOpenOrders
     * @description fetch all unfilled currently open orders
     * @see https://lightning.bitflyer.com/docs?lang=en#list-orders
     * @param {string} symbol unified market symbol
     * @param {int} [since] the earliest time in ms to fetch open orders for
     * @param {int} [limit] the maximum number of  open orders structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchOpenOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = 100, params = {}): Promise<Order[]> {
        const request: Dict = {
            'child_order_state': 'ACTIVE',
        };
        return await this.fetchOrders (symbol, since, limit, this.extend (request, params));
    }

    /**
     * @method
     * @name bitflyer#fetchClosedOrders
     * @description fetches information on multiple closed orders made by the user
     * @see https://lightning.bitflyer.com/docs?lang=en#list-orders
     * @param {string} symbol unified market symbol of the market orders were made in
     * @param {int} [since] the earliest time in ms to fetch orders for
     * @param {int} [limit] the maximum number of order structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchClosedOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = 100, params = {}): Promise<Order[]> {
        const request: Dict = {
            'child_order_state': 'COMPLETED',
        };
        return await this.fetchOrders (symbol, since, limit, this.extend (request, params));
    }

    /**
     * @method
     * @name bitflyer#fetchOrder
     * @description fetches information on an order made by the user
     * @see https://lightning.bitflyer.com/docs?lang=en#list-orders
     * @param {string} id the order id
     * @param {string} symbol unified symbol of the market the order was made in
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchOrder (id: string, symbol: Str = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchOrder() requires a symbol argument');
        }
        const orders = await this.fetchOrders (symbol);
        const ordersById = this.indexBy (orders, 'id');
        if (id in ordersById) {
            return ordersById[id] as Order;
        }
        throw new OrderNotFound (this.id + ' No order found with id ' + id);
    }

    /**
     * @method
     * @name bitflyer#fetchMyTrades
     * @description fetch all trades made by the user
     * @see https://lightning.bitflyer.com/docs?lang=en#list-executions
     * @param {string} symbol unified market symbol
     * @param {int} [since] the earliest time in ms to fetch trades for
     * @param {int} [limit] the maximum number of trades structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=trade-structure}
     */
    async fetchMyTrades (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchMyTrades() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'product_code': market['id'],
        };
        if (limit !== undefined) {
            request['count'] = limit;
        }
        const response = await this.privateGetGetexecutions (this.extend (request, params));
        //
        //    [
        //     {
        //       "id": 37233,
        //       "side": "BUY",
        //       "price": 33470,
        //       "size": 0.01,
        //       "exec_date": "2015-07-07T09:57:40.397",
        //       "child_order_id": "JOR20150707-060559-021935",
        //       "child_order_acceptance_id": "JRF20150707-060559-396699"
        //       "commission": 0,
        //     },
        //    ]
        //
        return this.parseTrades (response, market, since, limit);
    }

    /**
     * @method
     * @name bitflyer#fetchPositions
     * @description fetch all open positions
     * @see https://lightning.bitflyer.com/docs?lang=en#get-open-interest-summary
     * @param {string[]} symbols list of unified market symbols
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of [position structure]{@link https://docs.ccxt.com/#/?id=position-structure}
     */
    async fetchPositions (symbols: Strings = undefined, params = {}): Promise<Position[]> {
        if (symbols === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchPositions() requires a `symbols` argument, exactly one symbol in an array');
        }
        await this.loadMarkets ();
        const request: Dict = {
            'product_code': this.marketIds (symbols),
        };
        const response = await this.privateGetGetpositions (this.extend (request, params));
        //
        //     [
        //         {
        //             "product_code": "FX_BTC_JPY",
        //             "side": "BUY",
        //             "price": 36000,
        //             "size": 10,
        //             "commission": 0,
        //             "swap_point_accumulate": -35,
        //             "require_collateral": 120000,
        //             "open_date": "2015-11-03T10:04:45.011",
        //             "leverage": 3,
        //             "pnl": 965,
        //             "sfd": -0.5
        //         }
        //     ]
        //
        // todo unify parsePosition/parsePositions
        return response;
    }

    /**
     * @method
     * @name bitflyer#withdraw
     * @description make a withdrawal
     * @see https://lightning.bitflyer.com/docs?lang=en#withdrawing-funds
     * @param {string} code unified currency code
     * @param {float} amount the amount to withdraw
     * @param {string} address the address to withdraw to
     * @param {string} tag
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [transaction structure]{@link https://docs.ccxt.com/#/?id=transaction-structure}
     */
    async withdraw (code: string, amount: number, address: string, tag = undefined, params = {}): Promise<Transaction> {
        this.checkAddress (address);
        await this.loadMarkets ();
        if (code !== 'JPY' && code !== 'USD' && code !== 'EUR') {
            throw new ExchangeError (this.id + ' allows withdrawing JPY, USD, EUR only, ' + code + ' is not supported');
        }
        const currency = this.currency (code);
        const request: Dict = {
            'currency_code': currency['id'],
            'amount': amount,
            // 'bank_account_id': 1234,
        };
        const response = await this.privatePostWithdraw (this.extend (request, params));
        //
        //     {
        //         "message_id": "69476620-5056-4003-bcbe-42658a2b041b"
        //     }
        //
        return this.parseTransaction (response, currency);
    }

    /**
     * @method
     * @name bitflyer#fetchDeposits
     * @description fetch all deposits made to an account
     * @see https://lightning.bitflyer.com/docs?lang=en#get-crypto-assets-deposit-history
     * @param {string} code unified currency code
     * @param {int} [since] the earliest time in ms to fetch deposits for
     * @param {int} [limit] the maximum number of deposits structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of [transaction structures]{@link https://docs.ccxt.com/#/?id=transaction-structure}
     */
    async fetchDeposits (code: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Transaction[]> {
        await this.loadMarkets ();
        let currency = undefined;
        const request: Dict = {};
        if (code !== undefined) {
            currency = this.currency (code);
        }
        if (limit !== undefined) {
            request['count'] = limit; // default 100
        }
        const response = await this.privateGetGetcoinins (this.extend (request, params));
        //
        //     [
        //         {
        //             "id": 100,
        //             "order_id": "CDP20151227-024141-055555",
        //             "currency_code": "BTC",
        //             "amount": 0.00002,
        //             "address": "1WriteySQufKZ2pVuM1oMhPrTtTVFq35j",
        //             "tx_hash": "9f92ee65a176bb9545f7becb8706c50d07d4cee5ffca34d8be3ef11d411405ae",
        //             "status": "COMPLETED",
        //             "event_date": "2015-11-27T08:59:20.301"
        //         }
        //     ]
        //
        return this.parseTransactions (response, currency, since, limit);
    }

    /**
     * @method
     * @name bitflyer#fetchWithdrawals
     * @description fetch all withdrawals made from an account
     * @see https://lightning.bitflyer.com/docs?lang=en#get-crypto-assets-transaction-history
     * @param {string} code unified currency code
     * @param {int} [since] the earliest time in ms to fetch withdrawals for
     * @param {int} [limit] the maximum number of withdrawals structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of [transaction structures]{@link https://docs.ccxt.com/#/?id=transaction-structure}
     */
    async fetchWithdrawals (code: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Transaction[]> {
        await this.loadMarkets ();
        let currency = undefined;
        const request: Dict = {};
        if (code !== undefined) {
            currency = this.currency (code);
        }
        if (limit !== undefined) {
            request['count'] = limit; // default 100
        }
        const response = await this.privateGetGetcoinouts (this.extend (request, params));
        //
        //     [
        //         {
        //             "id": 500,
        //             "order_id": "CWD20151224-014040-077777",
        //             "currency_code": "BTC",
        //             "amount": 0.1234,
        //             "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
        //             "tx_hash": "724c07dfd4044abcb390b0412c3e707dd5c4f373f0a52b3bd295ce32b478c60a",
        //             "fee": 0.0005,
        //             "additional_fee": 0.0001,
        //             "status": "COMPLETED",
        //             "event_date": "2015-12-24T01:40:40.397"
        //         }
        //     ]
        //
        return this.parseTransactions (response, currency, since, limit);
    }

    parseDepositStatus (status) {
        const statuses: Dict = {
            'PENDING': 'pending',
            'COMPLETED': 'ok',
        };
        return this.safeString (statuses, status, status);
    }

    parseWithdrawalStatus (status) {
        const statuses: Dict = {
            'PENDING': 'pending',
            'COMPLETED': 'ok',
        };
        return this.safeString (statuses, status, status);
    }

    parseTransaction (transaction: Dict, currency: Currency = undefined): Transaction {
        //
        // fetchDeposits
        //
        //     {
        //         "id": 100,
        //         "order_id": "CDP20151227-024141-055555",
        //         "currency_code": "BTC",
        //         "amount": 0.00002,
        //         "address": "1WriteySQufKZ2pVuM1oMhPrTtTVFq35j",
        //         "tx_hash": "9f92ee65a176bb9545f7becb8706c50d07d4cee5ffca34d8be3ef11d411405ae",
        //         "status": "COMPLETED",
        //         "event_date": "2015-11-27T08:59:20.301"
        //     }
        //
        // fetchWithdrawals
        //
        //     {
        //         "id": 500,
        //         "order_id": "CWD20151224-014040-077777",
        //         "currency_code": "BTC",
        //         "amount": 0.1234,
        //         "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
        //         "tx_hash": "724c07dfd4044abcb390b0412c3e707dd5c4f373f0a52b3bd295ce32b478c60a",
        //         "fee": 0.0005,
        //         "additional_fee": 0.0001,
        //         "status": "COMPLETED",
        //         "event_date": "2015-12-24T01:40:40.397"
        //     }
        //
        // withdraw
        //
        //     {
        //         "message_id": "69476620-5056-4003-bcbe-42658a2b041b"
        //     }
        //
        const id = this.safeString2 (transaction, 'id', 'message_id');
        const address = this.safeString (transaction, 'address');
        const currencyId = this.safeString (transaction, 'currency_code');
        const code = this.safeCurrencyCode (currencyId, currency);
        const timestamp = this.parse8601 (this.safeString (transaction, 'event_date'));
        const amount = this.safeNumber (transaction, 'amount');
        const txId = this.safeString (transaction, 'tx_hash');
        const rawStatus = this.safeString (transaction, 'status');
        let type = undefined;
        let status = undefined;
        let fee = undefined;
        if ('fee' in transaction) {
            type = 'withdrawal';
            status = this.parseWithdrawalStatus (rawStatus);
            const feeCost = this.safeString (transaction, 'fee');
            const additionalFee = this.safeString (transaction, 'additional_fee');
            fee = { 'currency': code, 'cost': this.parseNumber (Precise.stringAdd (feeCost, additionalFee)) };
        } else {
            type = 'deposit';
            status = this.parseDepositStatus (rawStatus);
        }
        return {
            'info': transaction,
            'id': id,
            'txid': txId,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'network': undefined,
            'address': address,
            'addressTo': address,
            'addressFrom': undefined,
            'tag': undefined,
            'tagTo': undefined,
            'tagFrom': undefined,
            'type': type,
            'amount': amount,
            'currency': code,
            'status': status,
            'updated': undefined,
            'comment': undefined,
            'internal': undefined,
            'fee': fee,
        } as Transaction;
    }

    /**
     * @method
     * @name bitflyer#fetchFundingRate
     * @description fetch the current funding rate
     * @see https://lightning.bitflyer.com/docs#funding-rate
     * @param {string} symbol unified market symbol
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [funding rate structure]{@link https://docs.ccxt.com/#/?id=funding-rate-structure}
     */
    async fetchFundingRate (symbol: string, params = {}): Promise<FundingRate> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'product_code': market['id'],
        };
        const response = await this.publicGetGetfundingrate (this.extend (request, params));
        //
        //    {
        //        "current_funding_rate": -0.003750000000
        //        "next_funding_rate_settledate": "2024-04-15T13:00:00"
        //    }
        //
        return this.parseFundingRate (response, market);
    }

    parseFundingRate (contract, market: Market = undefined): FundingRate {
        //
        //    {
        //        "current_funding_rate": -0.003750000000
        //        "next_funding_rate_settledate": "2024-04-15T13:00:00"
        //    }
        //
        const nextFundingDatetime = this.safeString (contract, 'next_funding_rate_settledate');
        const nextFundingTimestamp = this.parse8601 (nextFundingDatetime);
        return {
            'info': contract,
            'symbol': this.safeString (market, 'symbol'),
            'markPrice': undefined,
            'indexPrice': undefined,
            'interestRate': undefined,
            'estimatedSettlePrice': undefined,
            'timestamp': undefined,
            'datetime': undefined,
            'fundingRate': undefined,
            'fundingTimestamp': undefined,
            'fundingDatetime': undefined,
            'nextFundingRate': this.safeNumber (contract, 'current_funding_rate'),
            'nextFundingTimestamp': nextFundingTimestamp,
            'nextFundingDatetime': this.iso8601 (nextFundingTimestamp),
            'previousFundingRate': undefined,
            'previousFundingTimestamp': undefined,
            'previousFundingDatetime': undefined,
            'interval': undefined,
        } as FundingRate;
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let request = '/' + this.version + '/';
        if (api === 'private') {
            request += 'me/';
        }
        request += path;
        if (method === 'GET') {
            if (Object.keys (params).length) {
                request += '?' + this.urlencode (params);
            }
        }
        const baseUrl = this.implodeHostname (this.urls['api']['rest']);
        const url = baseUrl + request;
        if (api === 'private') {
            this.checkRequiredCredentials ();
            const nonce = this.nonce ().toString ();
            let auth = [ nonce, method, request ].join ('');
            if (Object.keys (params).length) {
                if (method !== 'GET') {
                    body = this.json (params);
                    auth += body;
                }
            }
            headers = {
                'ACCESS-KEY': this.apiKey,
                'ACCESS-TIMESTAMP': nonce,
                'ACCESS-SIGN': this.hmac (this.encode (auth), this.encode (this.secret), sha256),
                'Content-Type': 'application/json',
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    handleErrors (code: int, reason: string, url: string, method: string, headers: Dict, body: string, response, requestHeaders, requestBody) {
        if (response === undefined) {
            return undefined; // fallback to the default error handler
        }
        const feedback = this.id + ' ' + body;
        // i.e. {"status":-2,"error_message":"Under maintenance","data":null}
        const errorMessage = this.safeString (response, 'error_message');
        const statusCode = this.safeInteger (response, 'status');
        if (errorMessage !== undefined) {
            this.throwExactlyMatchedException (this.exceptions['exact'], statusCode, feedback);
            throw new ExchangeError (feedback);
        }
        return undefined;
    }
}
