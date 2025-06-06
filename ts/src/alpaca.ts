//  ---------------------------------------------------------------------------

import Exchange from './abstract/alpaca.js';
import { Precise } from './base/Precise.js';
import { ExchangeError, BadRequest, PermissionDenied, BadSymbol, NotSupported, InsufficientFunds, InvalidOrder, RateLimitExceeded, ArgumentsRequired } from './base/errors.js';
import { TICK_SIZE } from './base/functions/number.js';
import type { Dict, Int, Market, Num, OHLCV, Order, OrderBook, OrderSide, OrderType, Str, Trade, int, Strings, Ticker, Tickers, Currency, DepositAddress, Transaction, Balances } from './base/types.js';

//  ---------------------------------------------------------------------------xs
/**
 * @class alpaca
 * @augments Exchange
 */
export default class alpaca extends Exchange {
    describe (): any {
        return this.deepExtend (super.describe (), {
            'id': 'alpaca',
            'name': 'Alpaca',
            'countries': [ 'US' ],
            // 3 req/s for free
            // 150 req/s for subscribers: https://alpaca.markets/data
            // for brokers: https://alpaca.markets/docs/api-references/broker-api/#authentication-and-rate-limit
            'rateLimit': 333,
            'hostname': 'alpaca.markets',
            'pro': true,
            'urls': {
                'logo': 'https://github.com/user-attachments/assets/e9476df8-a450-4c3e-ab9a-1a7794219e1b',
                'www': 'https://alpaca.markets',
                'api': {
                    'broker': 'https://broker-api.{hostname}',
                    'trader': 'https://api.{hostname}',
                    'market': 'https://data.{hostname}',
                },
                'test': {
                    'broker': 'https://broker-api.sandbox.{hostname}',
                    'trader': 'https://paper-api.{hostname}',
                    'market': 'https://data.{hostname}',
                },
                'doc': 'https://alpaca.markets/docs/',
                'fees': 'https://docs.alpaca.markets/docs/crypto-fees',
            },
            'has': {
                'CORS': false,
                'spot': true,
                'margin': false,
                'swap': false,
                'future': false,
                'option': false,
                'addMargin': false,
                'borrowCrossMargin': false,
                'borrowIsolatedMargin': false,
                'borrowMargin': false,
                'cancelAllOrders': true,
                'cancelOrder': true,
                'closeAllPositions': false,
                'closePosition': false,
                'createMarketBuyOrder': true,
                'createMarketBuyOrderWithCost': true,
                'createMarketOrderWithCost': true,
                'createOrder': true,
                'createOrderWithTakeProfitAndStopLoss': false,
                'createOrderWithTakeProfitAndStopLossWs': false,
                'createReduceOnlyOrder': false,
                'createStopOrder': true,
                'createTriggerOrder': true,
                'editOrder': true,
                'fetchBalance': true,
                'fetchBidsAsks': false,
                'fetchBorrowInterest': false,
                'fetchBorrowRate': false,
                'fetchBorrowRateHistories': false,
                'fetchBorrowRateHistory': false,
                'fetchBorrowRates': false,
                'fetchBorrowRatesPerSymbol': false,
                'fetchClosedOrders': true,
                'fetchCrossBorrowRate': false,
                'fetchCrossBorrowRates': false,
                'fetchCurrencies': false,
                'fetchDepositAddress': true,
                'fetchDepositAddressesByNetwork': false,
                'fetchDeposits': true,
                'fetchDepositsWithdrawals': true,
                'fetchFundingHistory': false,
                'fetchFundingInterval': false,
                'fetchFundingIntervals': false,
                'fetchFundingRate': false,
                'fetchFundingRateHistory': false,
                'fetchFundingRates': false,
                'fetchGreeks': false,
                'fetchIndexOHLCV': false,
                'fetchIsolatedBorrowRate': false,
                'fetchIsolatedBorrowRates': false,
                'fetchIsolatedPositions': false,
                'fetchL1OrderBook': true,
                'fetchL2OrderBook': false,
                'fetchLeverage': false,
                'fetchLeverages': false,
                'fetchLeverageTiers': false,
                'fetchLiquidations': false,
                'fetchLongShortRatio': false,
                'fetchLongShortRatioHistory': false,
                'fetchMarginAdjustmentHistory': false,
                'fetchMarginMode': false,
                'fetchMarginModes': false,
                'fetchMarketLeverageTiers': false,
                'fetchMarkets': true,
                'fetchMarkOHLCV': false,
                'fetchMarkPrices': false,
                'fetchMyLiquidations': false,
                'fetchMySettlementHistory': false,
                'fetchMyTrades': true,
                'fetchOHLCV': true,
                'fetchOpenInterest': false,
                'fetchOpenInterestHistory': false,
                'fetchOpenInterests': false,
                'fetchOpenOrder': false,
                'fetchOpenOrders': true,
                'fetchOption': false,
                'fetchOptionChain': false,
                'fetchOrder': true,
                'fetchOrderBook': true,
                'fetchOrders': true,
                'fetchPosition': false,
                'fetchPositionHistory': false,
                'fetchPositionMode': false,
                'fetchPositions': false,
                'fetchPositionsForSymbol': false,
                'fetchPositionsHistory': false,
                'fetchPositionsRisk': false,
                'fetchPremiumIndexOHLCV': false,
                'fetchSettlementHistory': false,
                'fetchStatus': false,
                'fetchTicker': true,
                'fetchTickers': true,
                'fetchTime': true,
                'fetchTrades': true,
                'fetchTradingFee': false,
                'fetchTradingFees': false,
                'fetchTransactionFees': false,
                'fetchTransactions': false,
                'fetchTransfers': false,
                'fetchVolatilityHistory': false,
                'fetchWithdrawals': true,
                'reduceMargin': false,
                'repayCrossMargin': false,
                'repayIsolatedMargin': false,
                'sandbox': true,
                'setLeverage': false,
                'setMargin': false,
                'setMarginMode': false,
                'setPositionMode': false,
                'transfer': false,
                'withdraw': true,
            },
            'api': {
                'broker': {
                },
                'trader': {
                    'private': {
                        'get': [
                            'v2/account',
                            'v2/orders',
                            'v2/orders/{order_id}',
                            'v2/positions',
                            'v2/positions/{symbol_or_asset_id}',
                            'v2/account/portfolio/history',
                            'v2/watchlists',
                            'v2/watchlists/{watchlist_id}',
                            'v2/watchlists:by_name',
                            'v2/account/configurations',
                            'v2/account/activities',
                            'v2/account/activities/{activity_type}',
                            'v2/calendar',
                            'v2/clock',
                            'v2/assets',
                            'v2/assets/{symbol_or_asset_id}',
                            'v2/corporate_actions/announcements/{id}',
                            'v2/corporate_actions/announcements',
                            'v2/wallets',
                            'v2/wallets/transfers',
                        ],
                        'post': [
                            'v2/orders',
                            'v2/watchlists',
                            'v2/watchlists/{watchlist_id}',
                            'v2/watchlists:by_name',
                            'v2/wallets/transfers',
                        ],
                        'put': [
                            'v2/orders/{order_id}',
                            'v2/watchlists/{watchlist_id}',
                            'v2/watchlists:by_name',
                        ],
                        'patch': [
                            'v2/orders/{order_id}',
                            'v2/account/configurations',
                        ],
                        'delete': [
                            'v2/orders',
                            'v2/orders/{order_id}',
                            'v2/positions',
                            'v2/positions/{symbol_or_asset_id}',
                            'v2/watchlists/{watchlist_id}',
                            'v2/watchlists:by_name',
                            'v2/watchlists/{watchlist_id}/{symbol}',
                        ],
                    },
                },
                'market': {
                    'public': {
                        'get': [
                            'v1beta3/crypto/{loc}/bars',
                            'v1beta3/crypto/{loc}/latest/bars',
                            'v1beta3/crypto/{loc}/latest/orderbooks',
                            'v1beta3/crypto/{loc}/latest/quotes',
                            'v1beta3/crypto/{loc}/latest/trades',
                            'v1beta3/crypto/{loc}/quotes',
                            'v1beta3/crypto/{loc}/snapshots',
                            'v1beta3/crypto/{loc}/trades',
                        ],
                    },
                    'private': {
                        'get': [
                            'v1beta1/corporate-actions',
                            'v1beta1/forex/latest/rates',
                            'v1beta1/forex/rates',
                            'v1beta1/logos/{symbol}',
                            'v1beta1/news',
                            'v1beta1/screener/stocks/most-actives',
                            'v1beta1/screener/{market_type}/movers',
                            'v2/stocks/auctions',
                            'v2/stocks/bars',
                            'v2/stocks/bars/latest',
                            'v2/stocks/meta/conditions/{ticktype}',
                            'v2/stocks/meta/exchanges',
                            'v2/stocks/quotes',
                            'v2/stocks/quotes/latest',
                            'v2/stocks/snapshots',
                            'v2/stocks/trades',
                            'v2/stocks/trades/latest',
                            'v2/stocks/{symbol}/auctions',
                            'v2/stocks/{symbol}/bars',
                            'v2/stocks/{symbol}/bars/latest',
                            'v2/stocks/{symbol}/quotes',
                            'v2/stocks/{symbol}/quotes/latest',
                            'v2/stocks/{symbol}/snapshot',
                            'v2/stocks/{symbol}/trades',
                            'v2/stocks/{symbol}/trades/latest',
                        ],
                    },
                },
            },
            'timeframes': {
                '1m': '1min',
                '3m': '3min',
                '5m': '5min',
                '15m': '15min',
                '30m': '30min',
                '1h': '1H',
                '2h': '2H',
                '4h': '4H',
                '6h': '6H',
                '8h': '8H',
                '12h': '12H',
                '1d': '1D',
                '3d': '3D',
                '1w': '1W',
                '1M': '1M',
            },
            'precisionMode': TICK_SIZE,
            'requiredCredentials': {
                'apiKey': true,
                'secret': true,
            },
            'fees': {
                'trading': {
                    'tierBased': true,
                    'percentage': true,
                    'maker': this.parseNumber ('0.0015'),
                    'taker': this.parseNumber ('0.0025'),
                    'tiers': {
                        'taker': [
                            [ this.parseNumber ('0'), this.parseNumber ('0.0025') ],
                            [ this.parseNumber ('100000'), this.parseNumber ('0.0022') ],
                            [ this.parseNumber ('500000'), this.parseNumber ('0.0020') ],
                            [ this.parseNumber ('1000000'), this.parseNumber ('0.0018') ],
                            [ this.parseNumber ('10000000'), this.parseNumber ('0.0015') ],
                            [ this.parseNumber ('25000000'), this.parseNumber ('0.0013') ],
                            [ this.parseNumber ('50000000'), this.parseNumber ('0.0012') ],
                            [ this.parseNumber ('100000000'), this.parseNumber ('0.001') ],
                        ],
                        'maker': [
                            [ this.parseNumber ('0'), this.parseNumber ('0.0015') ],
                            [ this.parseNumber ('100000'), this.parseNumber ('0.0012') ],
                            [ this.parseNumber ('500000'), this.parseNumber ('0.001') ],
                            [ this.parseNumber ('1000000'), this.parseNumber ('0.0008') ],
                            [ this.parseNumber ('10000000'), this.parseNumber ('0.0005') ],
                            [ this.parseNumber ('25000000'), this.parseNumber ('0.0002') ],
                            [ this.parseNumber ('50000000'), this.parseNumber ('0.0002') ],
                            [ this.parseNumber ('100000000'), this.parseNumber ('0.00') ],
                        ],
                    },
                },
            },
            'headers': {
                'APCA-PARTNER-ID': 'ccxt',
            },
            'options': {
                'defaultExchange': 'CBSE',
                'exchanges': [
                    'CBSE', // Coinbase
                    'FTX', // FTXUS
                    'GNSS', // Genesis
                    'ERSX', // ErisX
                ],
                'defaultTimeInForce': 'gtc', // fok, gtc, ioc
                'clientOrderId': 'ccxt_{id}',
            },
            'features': {
                'spot': {
                    'sandbox': true,
                    'createOrder': {
                        'marginMode': false,
                        'triggerPrice': true,
                        'triggerPriceType': undefined,
                        'triggerDirection': false,
                        'stopLossPrice': false, // todo
                        'takeProfitPrice': false, // todo
                        'attachedStopLossTakeProfit': {
                            'triggerPriceType': {
                                'last': true,
                                'mark': true,
                                'index': true,
                            },
                            'price': true,
                        },
                        'timeInForce': {
                            'IOC': true,
                            'FOK': true,
                            'PO': true,
                            'GTD': false,
                        },
                        'hedged': false,
                        'trailing': true, // todo: implementation
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
                        'daysBack': 100000,
                        'untilDays': 100000,
                        'symbolRequired': false,
                    },
                    'fetchOrder': {
                        'marginMode': false,
                        'trigger': false,
                        'trailing': false,
                        'symbolRequired': false,
                    },
                    'fetchOpenOrders': {
                        'marginMode': false,
                        'limit': 500,
                        'trigger': false,
                        'trailing': false,
                        'symbolRequired': false,
                    },
                    'fetchOrders': {
                        'marginMode': false,
                        'limit': 500,
                        'daysBack': 100000,
                        'untilDays': 100000,
                        'trigger': false,
                        'trailing': false,
                        'symbolRequired': false,
                    },
                    'fetchClosedOrders': {
                        'marginMode': false,
                        'limit': 500,
                        'daysBack': 100000,
                        'daysBackCanceled': undefined,
                        'untilDays': 100000,
                        'trigger': false,
                        'trailing': false,
                        'symbolRequired': false,
                    },
                    'fetchOHLCV': {
                        'limit': 1000,
                    },
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
                    'forbidden.': PermissionDenied, // {"message": "forbidden."}
                    '40410000': InvalidOrder, // { "code": 40410000, "message": "order is not found."}
                    '40010001': BadRequest, // {"code":40010001,"message":"invalid order type for crypto order"}
                    '40110000': PermissionDenied, // { "code": 40110000, "message": "request is not authorized"}
                    '40310000': InsufficientFunds, // {"available":"0","balance":"0","code":40310000,"message":"insufficient balance for USDT (requested: 221.63, available: 0)","symbol":"USDT"}
                    '42910000': RateLimitExceeded, // {"code":42910000,"message":"rate limit exceeded"}
                },
                'broad': {
                    'Invalid format for parameter': BadRequest, // {"message":"Invalid format for parameter start: error parsing '0' as RFC3339 or 2006-01-02 time: parsing time \"0\" as \"2006-01-02\": cannot parse \"0\" as \"2006\""}
                    'Invalid symbol': BadSymbol, // {"message":"Invalid symbol(s): BTC/USDdsda does not match ^[A-Z]+/[A-Z]+$"}
                },
            },
        });
    }

    /**
     * @method
     * @name alpaca#fetchTime
     * @description fetches the current integer timestamp in milliseconds from the exchange server
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {int} the current integer timestamp in milliseconds from the exchange server
     */
    async fetchTime (params = {}): Promise<Int> {
        const response = await this.traderPrivateGetV2Clock (params);
        //
        //     {
        //         timestamp: '2023-11-22T08:07:57.654738097-05:00',
        //         is_open: false,
        //         next_open: '2023-11-22T09:30:00-05:00',
        //         next_close: '2023-11-22T16:00:00-05:00'
        //     }
        //
        const timestamp = this.safeString (response, 'timestamp');
        const localTime = timestamp.slice (0, 23);
        const jetlagStrStart = timestamp.length - 6;
        const jetlagStrEnd = timestamp.length - 3;
        const jetlag = timestamp.slice (jetlagStrStart, jetlagStrEnd);
        const iso = this.parse8601 (localTime) - this.parseToNumeric (jetlag) * 3600 * 1000;
        return iso;
    }

    /**
     * @method
     * @name alpaca#fetchMarkets
     * @description retrieves data on all markets for alpaca
     * @see https://docs.alpaca.markets/reference/get-v2-assets
     * @param {object} [params] extra parameters specific to the exchange api endpoint
     * @returns {object[]} an array of objects representing market data
     */
    async fetchMarkets (params = {}): Promise<Market[]> {
        const request: Dict = {
            'asset_class': 'crypto',
            'status': 'active',
        };
        const assets = await this.traderPrivateGetV2Assets (this.extend (request, params));
        //
        //     [
        //         {
        //             "id": "c150e086-1e75-44e6-9c2c-093bb1e93139",
        //             "class": "crypto",
        //             "exchange": "CRYPTO",
        //             "symbol": "BTC/USDT",
        //             "name": "Bitcoin / USD Tether",
        //             "status": "active",
        //             "tradable": true,
        //             "marginable": false,
        //             "maintenance_margin_requirement": 100,
        //             "shortable": false,
        //             "easy_to_borrow": false,
        //             "fractionable": true,
        //             "attributes": [],
        //             "min_order_size": "0.000026873",
        //             "min_trade_increment": "0.000000001",
        //             "price_increment": "1"
        //         }
        //     ]
        //
        return this.parseMarkets (assets);
    }

    parseMarket (asset): Market {
        //
        //     {
        //         "id": "c150e086-1e75-44e6-9c2c-093bb1e93139",
        //         "class": "crypto",
        //         "exchange": "CRYPTO",
        //         "symbol": "BTC/USDT",
        //         "name": "Bitcoin / USD Tether",
        //         "status": "active",
        //         "tradable": true,
        //         "marginable": false,
        //         "maintenance_margin_requirement": 101,
        //         "shortable": false,
        //         "easy_to_borrow": false,
        //         "fractionable": true,
        //         "attributes": [],
        //         "min_order_size": "0.000026873",
        //         "min_trade_increment": "0.000000001",
        //         "price_increment": "1"
        //     }
        //
        const marketId = this.safeString (asset, 'symbol');
        const parts = marketId.split ('/');
        const assetClass = this.safeString (asset, 'class');
        const baseId = this.safeString (parts, 0);
        const quoteId = this.safeString (parts, 1);
        const base = this.safeCurrencyCode (baseId);
        let quote = this.safeCurrencyCode (quoteId);
        // Us equity markets do not include quote in symbol.
        // We can safely coerce us_equity quote to USD
        if (quote === undefined && assetClass === 'us_equity') {
            quote = 'USD';
        }
        const symbol = base + '/' + quote;
        const status = this.safeString (asset, 'status');
        const active = (status === 'active');
        const minAmount = this.safeNumber (asset, 'min_order_size');
        const amount = this.safeNumber (asset, 'min_trade_increment');
        const price = this.safeNumber (asset, 'price_increment');
        return {
            'id': marketId,
            'symbol': symbol,
            'base': base,
            'quote': quote,
            'settle': undefined,
            'baseId': baseId,
            'quoteId': quoteId,
            'settleId': undefined,
            'type': 'spot',
            'spot': true,
            'margin': undefined,
            'swap': false,
            'future': false,
            'option': false,
            'active': active,
            'contract': false,
            'linear': undefined,
            'inverse': undefined,
            'contractSize': undefined,
            'expiry': undefined,
            'expiryDatetime': undefined,
            'strike': undefined,
            'optionType': undefined,
            'precision': {
                'amount': amount,
                'price': price,
            },
            'limits': {
                'leverage': {
                    'min': undefined,
                    'max': undefined,
                },
                'amount': {
                    'min': minAmount,
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
            'info': asset,
        };
    }

    /**
     * @method
     * @name alpaca#fetchTrades
     * @description get the list of most recent trades for a particular symbol
     * @see https://docs.alpaca.markets/reference/cryptotrades
     * @see https://docs.alpaca.markets/reference/cryptolatesttrades
     * @param {string} symbol unified symbol of the market to fetch trades for
     * @param {int} [since] timestamp in ms of the earliest trade to fetch
     * @param {int} [limit] the maximum amount of trades to fetch
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.loc] crypto location, default: us
     * @param {string} [params.method] method, default: marketPublicGetV1beta3CryptoLocTrades
     * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=public-trades}
     */
    async fetchTrades (symbol: string, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Trade[]> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const marketId = market['id'];
        const loc = this.safeString (params, 'loc', 'us');
        const method = this.safeString (params, 'method', 'marketPublicGetV1beta3CryptoLocTrades');
        const request: Dict = {
            'symbols': marketId,
            'loc': loc,
        };
        params = this.omit (params, [ 'loc', 'method' ]);
        let symbolTrades = undefined;
        if (method === 'marketPublicGetV1beta3CryptoLocTrades') {
            if (since !== undefined) {
                request['start'] = this.iso8601 (since);
            }
            if (limit !== undefined) {
                request['limit'] = limit;
            }
            const response = await this.marketPublicGetV1beta3CryptoLocTrades (this.extend (request, params));
            //
            //    {
            //        "next_page_token": null,
            //        "trades": {
            //            "BTC/USD": [
            //                {
            //                    "i": 36440704,
            //                    "p": 22625,
            //                    "s": 0.0001,
            //                    "t": "2022-07-21T11:47:31.073391Z",
            //                    "tks": "B"
            //                }
            //            ]
            //        }
            //    }
            //
            const trades = this.safeDict (response, 'trades', {});
            symbolTrades = this.safeList (trades, marketId, []);
        } else if (method === 'marketPublicGetV1beta3CryptoLocLatestTrades') {
            const response = await this.marketPublicGetV1beta3CryptoLocLatestTrades (this.extend (request, params));
            //
            //    {
            //       "trades": {
            //            "BTC/USD": {
            //                "i": 36440704,
            //                "p": 22625,
            //                "s": 0.0001,
            //                "t": "2022-07-21T11:47:31.073391Z",
            //                "tks": "B"
            //            }
            //        }
            //    }
            //
            const trades = this.safeDict (response, 'trades', {});
            symbolTrades = this.safeDict (trades, marketId, {});
            symbolTrades = [ symbolTrades ];
        } else {
            throw new NotSupported (this.id + ' fetchTrades() does not support ' + method + ', marketPublicGetV1beta3CryptoLocTrades and marketPublicGetV1beta3CryptoLocLatestTrades are supported');
        }
        return this.parseTrades (symbolTrades, market, since, limit);
    }

    /**
     * @method
     * @name alpaca#fetchOrderBook
     * @description fetches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
     * @see https://docs.alpaca.markets/reference/cryptolatestorderbooks
     * @param {string} symbol unified symbol of the market to fetch the order book for
     * @param {int} [limit] the maximum amount of order book entries to return
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.loc] crypto location, default: us
     * @returns {object} A dictionary of [order book structures]{@link https://github.com/ccxt/ccxt/wiki/Manual#order-book-structure} indexed by market symbols
     */
    async fetchOrderBook (symbol: string, limit: Int = undefined, params = {}): Promise<OrderBook> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const id = market['id'];
        const loc = this.safeString (params, 'loc', 'us');
        const request: Dict = {
            'symbols': id,
            'loc': loc,
        };
        const response = await this.marketPublicGetV1beta3CryptoLocLatestOrderbooks (this.extend (request, params));
        //
        //   {
        //       "orderbooks":{
        //          "BTC/USD":{
        //             "a":[
        //                {
        //                   "p":22208,
        //                   "s":0.0051
        //                },
        //                {
        //                   "p":22209,
        //                   "s":0.1123
        //                },
        //                {
        //                   "p":22210,
        //                   "s":0.2465
        //                }
        //             ],
        //             "b":[
        //                {
        //                   "p":22203,
        //                   "s":0.395
        //                },
        //                {
        //                   "p":22202,
        //                   "s":0.2465
        //                },
        //                {
        //                   "p":22201,
        //                   "s":0.6455
        //                }
        //             ],
        //             "t":"2022-07-19T13:41:55.13210112Z"
        //          }
        //       }
        //   }
        //
        const orderbooks = this.safeDict (response, 'orderbooks', {});
        const rawOrderbook = this.safeDict (orderbooks, id, {});
        const timestamp = this.parse8601 (this.safeString (rawOrderbook, 't'));
        return this.parseOrderBook (rawOrderbook, market['symbol'], timestamp, 'b', 'a', 'p', 's');
    }

    /**
     * @method
     * @name alpaca#fetchOHLCV
     * @description fetches historical candlestick data containing the open, high, low, and close price, and the volume of a market
     * @see https://docs.alpaca.markets/reference/cryptobars
     * @see https://docs.alpaca.markets/reference/cryptolatestbars
     * @param {string} symbol unified symbol of the market to fetch OHLCV data for
     * @param {string} timeframe the length of time each candle represents
     * @param {int} [since] timestamp in ms of the earliest candle to fetch
     * @param {int} [limit] the maximum amount of candles to fetch
     * @param {object} [params] extra parameters specific to the alpha api endpoint
     * @param {string} [params.loc] crypto location, default: us
     * @param {string} [params.method] method, default: marketPublicGetV1beta3CryptoLocBars
     * @returns {int[][]} A list of candles ordered as timestamp, open, high, low, close, volume
     */
    async fetchOHLCV (symbol: string, timeframe = '1m', since: Int = undefined, limit: Int = undefined, params = {}): Promise<OHLCV[]> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const marketId = market['id'];
        const loc = this.safeString (params, 'loc', 'us');
        const method = this.safeString (params, 'method', 'marketPublicGetV1beta3CryptoLocBars');
        const request: Dict = {
            'symbols': marketId,
            'loc': loc,
        };
        params = this.omit (params, [ 'loc', 'method' ]);
        let ohlcvs = undefined;
        if (method === 'marketPublicGetV1beta3CryptoLocBars') {
            if (limit !== undefined) {
                request['limit'] = limit;
            }
            if (since !== undefined) {
                request['start'] = this.yyyymmdd (since);
            }
            request['timeframe'] = this.safeString (this.timeframes, timeframe, timeframe);
            const response = await this.marketPublicGetV1beta3CryptoLocBars (this.extend (request, params));
            //
            //    {
            //        "bars": {
            //           "BTC/USD": [
            //              {
            //                 "c": 22887,
            //                 "h": 22888,
            //                 "l": 22873,
            //                 "n": 11,
            //                 "o": 22883,
            //                 "t": "2022-07-21T05:00:00Z",
            //                 "v": 1.1138,
            //                 "vw": 22883.0155324116
            //              },
            //              {
            //                 "c": 22895,
            //                 "h": 22895,
            //                 "l": 22884,
            //                 "n": 6,
            //                 "o": 22884,
            //                 "t": "2022-07-21T05:01:00Z",
            //                 "v": 0.001,
            //                 "vw": 22889.5
            //              }
            //           ]
            //        },
            //        "next_page_token": "QlRDL1VTRHxNfDIwMjItMDctMjFUMDU6MDE6MDAuMDAwMDAwMDAwWg=="
            //     }
            //
            const bars = this.safeDict (response, 'bars', {});
            ohlcvs = this.safeList (bars, marketId, []);
        } else if (method === 'marketPublicGetV1beta3CryptoLocLatestBars') {
            const response = await this.marketPublicGetV1beta3CryptoLocLatestBars (this.extend (request, params));
            //
            //    {
            //        "bars": {
            //           "BTC/USD": {
            //              "c": 22887,
            //              "h": 22888,
            //              "l": 22873,
            //              "n": 11,
            //              "o": 22883,
            //              "t": "2022-07-21T05:00:00Z",
            //              "v": 1.1138,
            //              "vw": 22883.0155324116
            //           }
            //        }
            //     }
            //
            const bars = this.safeDict (response, 'bars', {});
            ohlcvs = this.safeDict (bars, marketId, {});
            ohlcvs = [ ohlcvs ];
        } else {
            throw new NotSupported (this.id + ' fetchOHLCV() does not support ' + method + ', marketPublicGetV1beta3CryptoLocBars and marketPublicGetV1beta3CryptoLocLatestBars are supported');
        }
        return this.parseOHLCVs (ohlcvs, market, timeframe, since, limit);
    }

    parseOHLCV (ohlcv, market: Market = undefined): OHLCV {
        //
        //     {
        //        "c":22895,
        //        "h":22895,
        //        "l":22884,
        //        "n":6,
        //        "o":22884,
        //        "t":"2022-07-21T05:01:00Z",
        //        "v":0.001,
        //        "vw":22889.5
        //     }
        //
        const datetime = this.safeString (ohlcv, 't');
        const timestamp = this.parse8601 (datetime);
        return [
            timestamp, // timestamp
            this.safeNumber (ohlcv, 'o'), // open
            this.safeNumber (ohlcv, 'h'), // high
            this.safeNumber (ohlcv, 'l'), // low
            this.safeNumber (ohlcv, 'c'), // close
            this.safeNumber (ohlcv, 'v'), // volume
        ];
    }

    /**
     * @method
     * @name alpaca#fetchTicker
     * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
     * @see https://docs.alpaca.markets/reference/cryptosnapshots-1
     * @param {string} symbol unified symbol of the market to fetch the ticker for
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.loc] crypto location, default: us
     * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
     */
    async fetchTicker (symbol: string, params = {}): Promise<Ticker> {
        await this.loadMarkets ();
        symbol = this.symbol (symbol);
        const tickers = await this.fetchTickers ([ symbol ], params);
        return this.safeDict (tickers, symbol) as Ticker;
    }

    /**
     * @method
     * @name alpaca#fetchTickers
     * @description fetches price tickers for multiple markets, statistical information calculated over the past 24 hours for each market
     * @see https://docs.alpaca.markets/reference/cryptosnapshots-1
     * @param {string[]} symbols unified symbols of the markets to fetch tickers for
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.loc] crypto location, default: us
     * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
     */
    async fetchTickers (symbols: Strings = undefined, params = {}): Promise<Tickers> {
        if (symbols === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchTickers() requires a symbols argument');
        }
        await this.loadMarkets ();
        symbols = this.marketSymbols (symbols);
        const loc = this.safeString (params, 'loc', 'us');
        const ids = this.marketIds (symbols);
        const request = {
            'symbols': ids.join (','),
            'loc': loc,
        };
        params = this.omit (params, 'loc');
        const response = await this.marketPublicGetV1beta3CryptoLocSnapshots (this.extend (request, params));
        //
        //     {
        //         "snapshots": {
        //             "BTC/USD": {
        //                 "dailyBar": {
        //                     "c": 69403.554,
        //                     "h": 69609.6515,
        //                     "l": 69013.26,
        //                     "n": 9,
        //                     "o": 69536.7,
        //                     "t": "2024-11-01T05:00:00Z",
        //                     "v": 0.210809181,
        //                     "vw": 69327.655393908
        //                 },
        //                 "latestQuote": {
        //                     "ap": 69424.19,
        //                     "as": 0.68149,
        //                     "bp": 69366.086,
        //                     "bs": 0.68312,
        //                     "t": "2024-11-01T08:31:41.880246926Z"
        //                 },
        //                 "latestTrade": {
        //                     "i": 5272941104897543146,
        //                     "p": 69416.9,
        //                     "s": 0.014017324,
        //                     "t": "2024-11-01T08:14:28.245088803Z",
        //                     "tks": "B"
        //                 },
        //                 "minuteBar": {
        //                     "c": 69403.554,
        //                     "h": 69403.554,
        //                     "l": 69399.125,
        //                     "n": 0,
        //                     "o": 69399.125,
        //                     "t": "2024-11-01T08:30:00Z",
        //                     "v": 0,
        //                     "vw": 0
        //                 },
        //                 "prevDailyBar": {
        //                     "c": 69515.1415,
        //                     "h": 72668.837,
        //                     "l": 68796.85,
        //                     "n": 129,
        //                     "o": 72258.9,
        //                     "t": "2024-10-31T05:00:00Z",
        //                     "v": 2.217683307,
        //                     "vw": 70782.6811608144
        //                 }
        //             },
        //         }
        //     }
        //
        const results = [];
        const snapshots = this.safeDict (response, 'snapshots', {});
        const marketIds = Object.keys (snapshots);
        for (let i = 0; i < marketIds.length; i++) {
            const marketId = marketIds[i];
            const market = this.safeMarket (marketId);
            const entry = this.safeDict (snapshots, marketId);
            const dailyBar = this.safeDict (entry, 'dailyBar', {});
            const prevDailyBar = this.safeDict (entry, 'prevDailyBar', {});
            const latestQuote = this.safeDict (entry, 'latestQuote', {});
            const latestTrade = this.safeDict (entry, 'latestTrade', {});
            const datetime = this.safeString (latestQuote, 't');
            const ticker = this.safeTicker ({
                'info': entry,
                'symbol': market['symbol'],
                'timestamp': this.parse8601 (datetime),
                'datetime': datetime,
                'high': this.safeString (dailyBar, 'h'),
                'low': this.safeString (dailyBar, 'l'),
                'bid': this.safeString (latestQuote, 'bp'),
                'bidVolume': this.safeString (latestQuote, 'bs'),
                'ask': this.safeString (latestQuote, 'ap'),
                'askVolume': this.safeString (latestQuote, 'as'),
                'vwap': this.safeString (dailyBar, 'vw'),
                'open': this.safeString (dailyBar, 'o'),
                'close': this.safeString (dailyBar, 'c'),
                'last': this.safeString (latestTrade, 'p'),
                'previousClose': this.safeString (prevDailyBar, 'c'),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': this.safeString (dailyBar, 'v'),
                'quoteVolume': this.safeString (dailyBar, 'n'),
            }, market);
            results.push (ticker);
        }
        return this.filterByArray (results, 'symbol', symbols);
    }

    generateClientOrderId (params) {
        const clientOrderIdprefix = this.safeString (this.options, 'clientOrderId');
        const uuid = this.uuid ();
        const parts = uuid.split ('-');
        const random_id = parts.join ('');
        const defaultClientId = this.implodeParams (clientOrderIdprefix, { 'id': random_id });
        const clientOrderId = this.safeString (params, 'clientOrderId', defaultClientId);
        return clientOrderId;
    }

    /**
     * @method
     * @name alpaca#createMarketOrderWithCost
     * @description create a market order by providing the symbol, side and cost
     * @see https://docs.alpaca.markets/reference/postorder
     * @param {string} symbol unified symbol of the market to create an order in
     * @param {string} side 'buy' or 'sell'
     * @param {float} cost how much you want to trade in units of the quote currency
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async createMarketOrderWithCost (symbol: string, side: OrderSide, cost: number, params = {}) {
        await this.loadMarkets ();
        const req = {
            'cost': cost,
        };
        return await this.createOrder (symbol, 'market', side, 0, undefined, this.extend (req, params));
    }

    /**
     * @method
     * @name alpaca#createMarketBuyOrderWithCost
     * @description create a market buy order by providing the symbol and cost
     * @see https://docs.alpaca.markets/reference/postorder
     * @param {string} symbol unified symbol of the market to create an order in
     * @param {float} cost how much you want to trade in units of the quote currency
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async createMarketBuyOrderWithCost (symbol: string, cost: number, params = {}) {
        await this.loadMarkets ();
        const req = {
            'cost': cost,
        };
        return await this.createOrder (symbol, 'market', 'buy', 0, undefined, this.extend (req, params));
    }

    /**
     * @method
     * @name alpaca#createMarketSellOrderWithCost
     * @description create a market sell order by providing the symbol and cost
     * @see https://docs.alpaca.markets/reference/postorder
     * @param {string} symbol unified symbol of the market to create an order in
     * @param {float} cost how much you want to trade in units of the quote currency
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async createMarketSellOrderWithCost (symbol: string, cost: number, params = {}) {
        await this.loadMarkets ();
        const req = {
            'cost': cost,
        };
        return await this.createOrder (symbol, 'market', 'sell', cost, undefined, this.extend (req, params));
    }

    /**
     * @method
     * @name alpaca#createOrder
     * @description create a trade order
     * @see https://docs.alpaca.markets/reference/postorder
     * @param {string} symbol unified symbol of the market to create an order in
     * @param {string} type 'market', 'limit' or 'stop_limit'
     * @param {string} side 'buy' or 'sell'
     * @param {float} amount how much of currency you want to trade in units of base currency
     * @param {float} [price] the price at which the order is to be fulfilled, in units of the quote currency, ignored in market orders
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {float} [params.triggerPrice] The price at which a trigger order is triggered at
     * @param {float} [params.cost] *market orders only* the cost of the order in units of the quote currency
     * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async createOrder (symbol: string, type: OrderType, side: OrderSide, amount: number, price: Num = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const id = market['id'];
        const request: Dict = {
            'symbol': id,
            'side': side,
            'type': type, // market, limit, stop_limit
        };
        const triggerPrice = this.safeStringN (params, [ 'triggerPrice', 'stop_price' ]);
        if (triggerPrice !== undefined) {
            let newType: string;
            if (type.indexOf ('limit') >= 0) {
                newType = 'stop_limit';
            } else {
                throw new NotSupported (this.id + ' createOrder() does not support stop orders for ' + type + ' orders, only stop_limit orders are supported');
            }
            request['stop_price'] = this.priceToPrecision (symbol, triggerPrice);
            request['type'] = newType;
        }
        if (type.indexOf ('limit') >= 0) {
            request['limit_price'] = this.priceToPrecision (symbol, price);
        }
        const cost = this.safeString (params, 'cost');
        if (cost !== undefined) {
            params = this.omit (params, 'cost');
            request['notional'] = this.costToPrecision (symbol, cost);
        } else {
            request['qty'] = this.amountToPrecision (symbol, amount);
        }
        const defaultTIF = this.safeString (this.options, 'defaultTimeInForce');
        request['time_in_force'] = this.safeString (params, 'timeInForce', defaultTIF);
        params = this.omit (params, [ 'timeInForce', 'triggerPrice' ]);
        request['client_order_id'] = this.generateClientOrderId (params);
        params = this.omit (params, [ 'clientOrderId' ]);
        const order = await this.traderPrivatePostV2Orders (this.extend (request, params));
        //
        //   {
        //      "id": "61e69015-8549-4bfd-b9c3-01e75843f47d",
        //      "client_order_id": "eb9e2aaa-f71a-4f51-b5b4-52a6c565dad4",
        //      "created_at": "2021-03-16T18:38:01.942282Z",
        //      "updated_at": "2021-03-16T18:38:01.942282Z",
        //      "submitted_at": "2021-03-16T18:38:01.937734Z",
        //      "filled_at": null,
        //      "expired_at": null,
        //      "canceled_at": null,
        //      "failed_at": null,
        //      "replaced_at": null,
        //      "replaced_by": null,
        //      "replaces": null,
        //      "asset_id": "b0b6dd9d-8b9b-48a9-ba46-b9d54906e415",
        //      "symbol": "AAPL",
        //      "asset_class": "us_equity",
        //      "notional": "500",
        //      "qty": null,
        //      "filled_qty": "0",
        //      "filled_avg_price": null,
        //      "order_class": "",
        //      "order_type": "market",
        //      "type": "market",
        //      "side": "buy",
        //      "time_in_force": "day",
        //      "limit_price": null,
        //      "stop_price": null,
        //      "status": "accepted",
        //      "extended_hours": false,
        //      "legs": null,
        //      "trail_percent": null,
        //      "trail_price": null,
        //      "hwm": null
        //   }
        //
        return this.parseOrder (order, market);
    }

    /**
     * @method
     * @name alpaca#cancelOrder
     * @description cancels an open order
     * @see https://docs.alpaca.markets/reference/deleteorderbyorderid
     * @param {string} id order id
     * @param {string} symbol unified symbol of the market the order was made in
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async cancelOrder (id: string, symbol: Str = undefined, params = {}) {
        const request: Dict = {
            'order_id': id,
        };
        const response = await this.traderPrivateDeleteV2OrdersOrderId (this.extend (request, params));
        //
        //   {
        //       "code": 40410000,
        //       "message": "order is not found."
        //   }
        //
        return this.parseOrder (response);
    }

    /**
     * @method
     * @name alpaca#cancelAllOrders
     * @description cancel all open orders in a market
     * @see https://docs.alpaca.markets/reference/deleteallorders
     * @param {string} symbol alpaca cancelAllOrders cannot setting symbol, it will cancel all open orders
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async cancelAllOrders (symbol: Str = undefined, params = {}) {
        await this.loadMarkets ();
        const response = await this.traderPrivateDeleteV2Orders (params);
        if (Array.isArray (response)) {
            return this.parseOrders (response, undefined);
        } else {
            return [
                this.safeOrder ({
                    'info': response,
                }),
            ];
        }
    }

    /**
     * @method
     * @name alpaca#fetchOrder
     * @description fetches information on an order made by the user
     * @see https://docs.alpaca.markets/reference/getorderbyorderid
     * @param {string} id the order id
     * @param {string} symbol unified symbol of the market the order was made in
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchOrder (id: string, symbol: Str = undefined, params = {}) {
        await this.loadMarkets ();
        const request: Dict = {
            'order_id': id,
        };
        const order = await this.traderPrivateGetV2OrdersOrderId (this.extend (request, params));
        const marketId = this.safeString (order, 'symbol');
        const market = this.safeMarket (marketId);
        return this.parseOrder (order, market);
    }

    /**
     * @method
     * @name alpaca#fetchOrders
     * @description fetches information on multiple orders made by the user
     * @see https://docs.alpaca.markets/reference/getallorders
     * @param {string} symbol unified market symbol of the market orders were made in
     * @param {int} [since] the earliest time in ms to fetch orders for
     * @param {int} [limit] the maximum number of order structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.until] the latest time in ms to fetch orders for
     * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Order[]> {
        await this.loadMarkets ();
        const request: Dict = {
            'status': 'all',
        };
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['symbols'] = market['id'];
        }
        const until = this.safeInteger (params, 'until');
        if (until !== undefined) {
            params = this.omit (params, 'until');
            request['endTime'] = this.iso8601 (until);
        }
        if (since !== undefined) {
            request['after'] = this.iso8601 (since);
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const response = await this.traderPrivateGetV2Orders (this.extend (request, params));
        //
        //     [
        //         {
        //           "id": "cbaf12d7-69b8-49c0-a31b-b46af35c755c",
        //           "client_order_id": "ccxt_b36156ae6fd44d098ac9c179bab33efd",
        //           "created_at": "2023-11-17T04:21:42.234579Z",
        //           "updated_at": "2023-11-17T04:22:34.442765Z",
        //           "submitted_at": "2023-11-17T04:21:42.233357Z",
        //           "filled_at": null,
        //           "expired_at": null,
        //           "canceled_at": "2023-11-17T04:22:34.399019Z",
        //           "failed_at": null,
        //           "replaced_at": null,
        //           "replaced_by": null,
        //           "replaces": null,
        //           "asset_id": "77c6f47f-0939-4b23-b41e-47b4469c4bc8",
        //           "symbol": "LTC/USDT",
        //           "asset_class": "crypto",
        //           "notional": null,
        //           "qty": "0.001",
        //           "filled_qty": "0",
        //           "filled_avg_price": null,
        //           "order_class": "",
        //           "order_type": "limit",
        //           "type": "limit",
        //           "side": "sell",
        //           "time_in_force": "gtc",
        //           "limit_price": "1000",
        //           "stop_price": null,
        //           "status": "canceled",
        //           "extended_hours": false,
        //           "legs": null,
        //           "trail_percent": null,
        //           "trail_price": null,
        //           "hwm": null,
        //           "subtag": null,
        //           "source": "access_key"
        //         }
        //     ]
        //
        return this.parseOrders (response, market, since, limit);
    }

    /**
     * @method
     * @name alpaca#fetchOpenOrders
     * @description fetch all unfilled currently open orders
     * @see https://docs.alpaca.markets/reference/getallorders
     * @param {string} symbol unified market symbol of the market orders were made in
     * @param {int} [since] the earliest time in ms to fetch orders for
     * @param {int} [limit] the maximum number of order structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.until] the latest time in ms to fetch orders for
     * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchOpenOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Order[]> {
        const request: Dict = {
            'status': 'open',
        };
        return await this.fetchOrders (symbol, since, limit, this.extend (request, params));
    }

    /**
     * @method
     * @name alpaca#fetchClosedOrders
     * @description fetches information on multiple closed orders made by the user
     * @see https://docs.alpaca.markets/reference/getallorders
     * @param {string} symbol unified market symbol of the market orders were made in
     * @param {int} [since] the earliest time in ms to fetch orders for
     * @param {int} [limit] the maximum number of order structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.until] the latest time in ms to fetch orders for
     * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchClosedOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Order[]> {
        const request: Dict = {
            'status': 'closed',
        };
        return await this.fetchOrders (symbol, since, limit, this.extend (request, params));
    }

    /**
     * @method
     * @name alpaca#editOrder
     * @description edit a trade order
     * @see https://docs.alpaca.markets/reference/patchorderbyorderid-1
     * @param {string} id order id
     * @param {string} [symbol] unified symbol of the market to create an order in
     * @param {string} [type] 'market', 'limit' or 'stop_limit'
     * @param {string} [side] 'buy' or 'sell'
     * @param {float} [amount] how much of the currency you want to trade in units of the base currency
     * @param {float} [price] the price for the order, in units of the quote currency, ignored in market orders
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.triggerPrice] the price to trigger a stop order
     * @param {string} [params.timeInForce] for crypto trading either 'gtc' or 'ioc' can be used
     * @param {string} [params.clientOrderId] a unique identifier for the order, automatically generated if not sent
     * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async editOrder (id: string, symbol: string, type: OrderType, side: OrderSide, amount: Num = undefined, price: Num = undefined, params = {}) {
        await this.loadMarkets ();
        const request: Dict = {
            'order_id': id,
        };
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
        }
        if (amount !== undefined) {
            request['qty'] = this.amountToPrecision (symbol, amount);
        }
        const triggerPrice = this.safeStringN (params, [ 'triggerPrice', 'stop_price' ]);
        if (triggerPrice !== undefined) {
            request['stop_price'] = this.priceToPrecision (symbol, triggerPrice);
            params = this.omit (params, 'triggerPrice');
        }
        if (price !== undefined) {
            request['limit_price'] = this.priceToPrecision (symbol, price);
        }
        let timeInForce = undefined;
        [ timeInForce, params ] = this.handleOptionAndParams2 (params, 'editOrder', 'timeInForce', 'defaultTimeInForce');
        if (timeInForce !== undefined) {
            request['time_in_force'] = timeInForce;
        }
        request['client_order_id'] = this.generateClientOrderId (params);
        params = this.omit (params, [ 'clientOrderId' ]);
        const response = await this.traderPrivatePatchV2OrdersOrderId (this.extend (request, params));
        return this.parseOrder (response, market);
    }

    parseOrder (order: Dict, market: Market = undefined): Order {
        //
        //    {
        //        "id":"6ecfcc34-4bed-4b53-83ba-c564aa832a81",
        //        "client_order_id":"ccxt_1c6ceab0b5e84727b2f1c0394ba17560",
        //        "created_at":"2022-06-14T13:59:30.224037068Z",
        //        "updated_at":"2022-06-14T13:59:30.224037068Z",
        //        "submitted_at":"2022-06-14T13:59:30.221856828Z",
        //        "filled_at":null,
        //        "expired_at":null,
        //        "canceled_at":null,
        //        "failed_at":null,
        //        "replaced_at":null,
        //        "replaced_by":null,
        //        "replaces":null,
        //        "asset_id":"64bbff51-59d6-4b3c-9351-13ad85e3c752",
        //        "symbol":"BTCUSD",
        //        "asset_class":"crypto",
        //        "notional":null,
        //        "qty":"0.01",
        //        "filled_qty":"0",
        //        "filled_avg_price":null,
        //        "order_class":"",
        //        "order_type":"limit",
        //        "type":"limit",
        //        "side":"buy",
        //        "time_in_force":"day",
        //        "limit_price":"14000",
        //        "stop_price":null,
        //        "status":"accepted",
        //        "extended_hours":false,
        //        "legs":null,
        //        "trail_percent":null,
        //        "trail_price":null,
        //        "hwm":null,
        //        "commission":"0.42",
        //        "source":null
        //    }
        //
        const marketId = this.safeString (order, 'symbol');
        market = this.safeMarket (marketId, market);
        const symbol = market['symbol'];
        const alpacaStatus = this.safeString (order, 'status');
        const status = this.parseOrderStatus (alpacaStatus);
        const feeValue = this.safeString (order, 'commission');
        let fee = undefined;
        if (feeValue !== undefined) {
            fee = {
                'cost': feeValue,
                'currency': 'USD',
            };
        }
        let orderType = this.safeString (order, 'order_type');
        if (orderType !== undefined) {
            if (orderType.indexOf ('limit') >= 0) {
                // might be limit or stop-limit
                orderType = 'limit';
            }
        }
        const datetime = this.safeString (order, 'submitted_at');
        const timestamp = this.parse8601 (datetime);
        return this.safeOrder ({
            'id': this.safeString (order, 'id'),
            'clientOrderId': this.safeString (order, 'client_order_id'),
            'timestamp': timestamp,
            'datetime': datetime,
            'lastTradeTimeStamp': undefined,
            'status': status,
            'symbol': symbol,
            'type': orderType,
            'timeInForce': this.parseTimeInForce (this.safeString (order, 'time_in_force')),
            'postOnly': undefined,
            'side': this.safeString (order, 'side'),
            'price': this.safeNumber (order, 'limit_price'),
            'triggerPrice': this.safeNumber (order, 'stop_price'),
            'cost': undefined,
            'average': this.safeNumber (order, 'filled_avg_price'),
            'amount': this.safeNumber (order, 'qty'),
            'filled': this.safeNumber (order, 'filled_qty'),
            'remaining': undefined,
            'trades': undefined,
            'fee': fee,
            'info': order,
        }, market);
    }

    parseOrderStatus (status: Str) {
        const statuses: Dict = {
            'pending_new': 'open',
            'accepted': 'open',
            'new': 'open',
            'partially_filled': 'open',
            'activated': 'open',
            'filled': 'closed',
        };
        return this.safeString (statuses, status, status);
    }

    parseTimeInForce (timeInForce: Str) {
        const timeInForces: Dict = {
            'day': 'Day',
        };
        return this.safeString (timeInForces, timeInForce, timeInForce);
    }

    /**
     * @method
     * @name alpaca#fetchMyTrades
     * @description fetch all trades made by the user
     * @see https://docs.alpaca.markets/reference/getaccountactivitiesbyactivitytype-1
     * @param {string} [symbol] unified market symbol
     * @param {int} [since] the earliest time in ms to fetch trades for
     * @param {int} [limit] the maximum number of trade structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.until] the latest time in ms to fetch trades for
     * @param {string} [params.page_token] page_token - used for paging
     * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=trade-structure}
     */
    async fetchMyTrades (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        await this.loadMarkets ();
        let market = undefined;
        let request: Dict = {
            'activity_type': 'FILL',
        };
        if (symbol !== undefined) {
            market = this.market (symbol);
        }
        const until = this.safeInteger (params, 'until');
        if (until !== undefined) {
            params = this.omit (params, 'until');
            request['until'] = this.iso8601 (until);
        }
        if (since !== undefined) {
            request['after'] = this.iso8601 (since);
        }
        if (limit !== undefined) {
            request['page_size'] = limit;
        }
        [ request, params ] = this.handleUntilOption ('until', request, params);
        const response = await this.traderPrivateGetV2AccountActivitiesActivityType (this.extend (request, params));
        //
        //     [
        //         {
        //             "id": "20221228071929579::ca2aafd0-1270-4b56-b0a9-85423b4a07c8",
        //             "activity_type": "FILL",
        //             "transaction_time": "2022-12-28T12:19:29.579352Z",
        //             "type": "fill",
        //             "price": "67.31",
        //             "qty": "0.07",
        //             "side": "sell",
        //             "symbol": "LTC/USD",
        //             "leaves_qty": "0",
        //             "order_id": "82eebcf7-6e66-4b7e-93f8-be0df0e4f12e",
        //             "cum_qty": "0.07",
        //             "order_status": "filled",
        //             "swap_rate": "1"
        //         },
        //     ]
        //
        return this.parseTrades (response, market, since, limit);
    }

    parseTrade (trade: Dict, market: Market = undefined): Trade {
        //
        // fetchTrades
        //
        //   {
        //       "t":"2022-06-14T05:00:00.027869Z",
        //       "x":"CBSE",
        //       "p":"21942.15",
        //       "s":"0.0001",
        //       "tks":"S",
        //       "i":"355681339"
        //   }
        //
        // fetchMyTrades
        //
        //     {
        //         "id": "20221228071929579::ca2aafd0-1270-4b56-b0a9-85423b4a07c8",
        //         "activity_type": "FILL",
        //         "transaction_time": "2022-12-28T12:19:29.579352Z",
        //         "type": "fill",
        //         "price": "67.31",
        //         "qty": "0.07",
        //         "side": "sell",
        //         "symbol": "LTC/USD",
        //         "leaves_qty": "0",
        //         "order_id": "82eebcf7-6e66-4b7e-93f8-be0df0e4f12e",
        //         "cum_qty": "0.07",
        //         "order_status": "filled",
        //         "swap_rate": "1"
        //     },
        //
        const marketId = this.safeString2 (trade, 'S', 'symbol');
        const symbol = this.safeSymbol (marketId, market);
        const datetime = this.safeString2 (trade, 't', 'transaction_time');
        const timestamp = this.parse8601 (datetime);
        const alpacaSide = this.safeString (trade, 'tks');
        let side = this.safeString (trade, 'side');
        if (alpacaSide === 'B') {
            side = 'buy';
        } else if (alpacaSide === 'S') {
            side = 'sell';
        }
        const priceString = this.safeString2 (trade, 'p', 'price');
        const amountString = this.safeString2 (trade, 's', 'qty');
        return this.safeTrade ({
            'info': trade,
            'id': this.safeString2 (trade, 'i', 'id'),
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': symbol,
            'order': this.safeString (trade, 'order_id'),
            'type': undefined,
            'side': side,
            'takerOrMaker': 'taker',
            'price': priceString,
            'amount': amountString,
            'cost': undefined,
            'fee': undefined,
        }, market);
    }

    /**
     * @method
     * @name alpaca#fetchDepositAddress
     * @description fetch the deposit address for a currency associated with this account
     * @see https://docs.alpaca.markets/reference/listcryptofundingwallets
     * @param {string} code unified currency code
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an [address structure]{@link https://docs.ccxt.com/#/?id=address-structure}
     */
    async fetchDepositAddress (code: string, params = {}): Promise<DepositAddress> {
        await this.loadMarkets ();
        const currency = this.currency (code);
        const request: Dict = {
            'asset': currency['id'],
        };
        const response = await this.traderPrivateGetV2Wallets (this.extend (request, params));
        //
        //     {
        //         "asset_id": "4fa30c85-77b7-4cbc-92dd-7b7513640aad",
        //         "address": "bc1q2fpskfnwem3uq9z8660e4z6pfv7aqfamysk75r",
        //         "created_at": "2024-11-03T07:30:05.609976344Z"
        //     }
        //
        return this.parseDepositAddress (response, currency);
    }

    parseDepositAddress (depositAddress, currency: Currency = undefined): DepositAddress {
        //
        //     {
        //         "asset_id": "4fa30c85-77b7-4cbc-92dd-7b7513640aad",
        //         "address": "bc1q2fpskfnwem3uq9z8660e4z6pfv7aqfamysk75r",
        //         "created_at": "2024-11-03T07:30:05.609976344Z"
        //     }
        //
        let parsedCurrency = undefined;
        if (currency !== undefined) {
            parsedCurrency = currency['id'];
        }
        return {
            'info': depositAddress,
            'currency': parsedCurrency,
            'network': undefined,
            'address': this.safeString (depositAddress, 'address'),
            'tag': undefined,
        } as DepositAddress;
    }

    /**
     * @method
     * @name alpaca#withdraw
     * @description make a withdrawal
     * @see https://docs.alpaca.markets/reference/createcryptotransferforaccount
     * @param {string} code unified currency code
     * @param {float} amount the amount to withdraw
     * @param {string} address the address to withdraw to
     * @param {string} tag a memo for the transaction
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [transaction structure]{@link https://docs.ccxt.com/#/?id=transaction-structure}
     */
    async withdraw (code: string, amount: number, address: string, tag = undefined, params = {}): Promise<Transaction> {
        [ tag, params ] = this.handleWithdrawTagAndParams (tag, params);
        this.checkAddress (address);
        await this.loadMarkets ();
        const currency = this.currency (code);
        if (tag) {
            address = address + ':' + tag;
        }
        const request: Dict = {
            'asset': currency['id'],
            'address': address,
            'amount': this.numberToString (amount),
        };
        const response = await this.traderPrivatePostV2WalletsTransfers (this.extend (request, params));
        //
        //     {
        //         "id": "e27b70a6-5610-40d7-8468-a516a284b776",
        //         "tx_hash": null,
        //         "direction": "OUTGOING",
        //         "amount": "20",
        //         "usd_value": "19.99856",
        //         "chain": "ETH",
        //         "asset": "USDT",
        //         "from_address": "0x123930E4dCA196E070d39B60c644C8Aae02f23",
        //         "to_address": "0x1232c0925196e4dcf05945f67f690153190fbaab",
        //         "status": "PROCESSING",
        //         "created_at": "2024-11-07T02:39:01.775495Z",
        //         "network_fee": "4",
        //         "fees": "0.1"
        //     }
        //
        return this.parseTransaction (response, currency);
    }

    async fetchTransactionsHelper (type, code, since, limit, params) {
        await this.loadMarkets ();
        let currency = undefined;
        if (code !== undefined) {
            currency = this.currency (code);
        }
        const response = await this.traderPrivateGetV2WalletsTransfers (params);
        //
        //     {
        //         "id": "e27b70a6-5610-40d7-8468-a516a284b776",
        //         "tx_hash": null,
        //         "direction": "OUTGOING",
        //         "amount": "20",
        //         "usd_value": "19.99856",
        //         "chain": "ETH",
        //         "asset": "USDT",
        //         "from_address": "0x123930E4dCA196E070d39B60c644C8Aae02f23",
        //         "to_address": "0x1232c0925196e4dcf05945f67f690153190fbaab",
        //         "status": "PROCESSING",
        //         "created_at": "2024-11-07T02:39:01.775495Z",
        //         "network_fee": "4",
        //         "fees": "0.1"
        //     }
        //
        const results = [];
        for (let i = 0; i < response.length; i++) {
            const entry = response[i];
            const direction = this.safeString (entry, 'direction');
            if (direction === type) {
                results.push (entry);
            } else if (type === 'BOTH') {
                results.push (entry);
            }
        }
        return this.parseTransactions (results, currency, since, limit, params);
    }

    /**
     * @method
     * @name alpaca#fetchDepositsWithdrawals
     * @description fetch history of deposits and withdrawals
     * @see https://docs.alpaca.markets/reference/listcryptofundingtransfers
     * @param {string} [code] unified currency code for the currency of the deposit/withdrawals, default is undefined
     * @param {int} [since] timestamp in ms of the earliest deposit/withdrawal, default is undefined
     * @param {int} [limit] max number of deposit/withdrawals to return, default is undefined
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a list of [transaction structure]{@link https://docs.ccxt.com/#/?id=transaction-structure}
     */
    async fetchDepositsWithdrawals (code: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Transaction[]> {
        return await this.fetchTransactionsHelper ('BOTH', code, since, limit, params);
    }

    /**
     * @method
     * @name alpaca#fetchDeposits
     * @description fetch all deposits made to an account
     * @see https://docs.alpaca.markets/reference/listcryptofundingtransfers
     * @param {string} [code] unified currency code
     * @param {int} [since] the earliest time in ms to fetch deposits for
     * @param {int} [limit] the maximum number of deposit structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of [transaction structures]{@link https://docs.ccxt.com/#/?id=transaction-structure}
     */
    async fetchDeposits (code: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Transaction[]> {
        return await this.fetchTransactionsHelper ('INCOMING', code, since, limit, params);
    }

    /**
     * @method
     * @name alpaca#fetchWithdrawals
     * @description fetch all withdrawals made from an account
     * @see https://docs.alpaca.markets/reference/listcryptofundingtransfers
     * @param {string} [code] unified currency code
     * @param {int} [since] the earliest time in ms to fetch withdrawals for
     * @param {int} [limit] the maximum number of withdrawal structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of [transaction structures]{@link https://docs.ccxt.com/#/?id=transaction-structure}
     */
    async fetchWithdrawals (code: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Transaction[]> {
        return await this.fetchTransactionsHelper ('OUTGOING', code, since, limit, params);
    }

    parseTransaction (transaction: Dict, currency: Currency = undefined): Transaction {
        //
        //     {
        //         "id": "e27b70a6-5610-40d7-8468-a516a284b776",
        //         "tx_hash": null,
        //         "direction": "OUTGOING",
        //         "amount": "20",
        //         "usd_value": "19.99856",
        //         "chain": "ETH",
        //         "asset": "USDT",
        //         "from_address": "0x123930E4dCA196E070d39B60c644C8Aae02f23",
        //         "to_address": "0x1232c0925196e4dcf05945f67f690153190fbaab",
        //         "status": "PROCESSING",
        //         "created_at": "2024-11-07T02:39:01.775495Z",
        //         "network_fee": "4",
        //         "fees": "0.1"
        //     }
        //
        const datetime = this.safeString (transaction, 'created_at');
        const currencyId = this.safeString (transaction, 'asset');
        const code = this.safeCurrencyCode (currencyId, currency);
        const fees = this.safeString (transaction, 'fees');
        const networkFee = this.safeString (transaction, 'network_fee');
        const totalFee = Precise.stringAdd (fees, networkFee);
        const fee = {
            'cost': this.parseNumber (totalFee),
            'currency': code,
        };
        return {
            'info': transaction,
            'id': this.safeString (transaction, 'id'),
            'txid': this.safeString (transaction, 'tx_hash'),
            'timestamp': this.parse8601 (datetime),
            'datetime': datetime,
            'network': this.safeString (transaction, 'chain'),
            'address': this.safeString (transaction, 'to_address'),
            'addressTo': this.safeString (transaction, 'to_address'),
            'addressFrom': this.safeString (transaction, 'from_address'),
            'tag': undefined,
            'tagTo': undefined,
            'tagFrom': undefined,
            'type': this.parseTransactionType (this.safeString (transaction, 'direction')),
            'amount': this.safeNumber (transaction, 'amount'),
            'currency': code,
            'status': this.parseTransactionStatus (this.safeString (transaction, 'status')),
            'updated': undefined,
            'fee': fee,
            'comment': undefined,
            'internal': undefined,
        } as Transaction;
    }

    parseTransactionStatus (status: Str) {
        const statuses: Dict = {
            'PROCESSING': 'pending',
            'FAILED': 'failed',
            'COMPLETE': 'ok',
        };
        return this.safeString (statuses, status, status);
    }

    parseTransactionType (type) {
        const types: Dict = {
            'INCOMING': 'deposit',
            'OUTGOING': 'withdrawal',
        };
        return this.safeString (types, type, type);
    }

    /**
     * @method
     * @name alpaca#fetchBalance
     * @description query for balance and get the amount of funds available for trading or funds locked in orders
     * @see https://docs.alpaca.markets/reference/getaccount-1
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [balance structure]{@link https://docs.ccxt.com/#/?id=balance-structure}
     */
    async fetchBalance (params = {}): Promise<Balances> {
        await this.loadMarkets ();
        const response = await this.traderPrivateGetV2Account (params);
        //
        //     {
        //         "id": "43a01bde-4eb1-64fssc26adb5",
        //         "admin_configurations": {
        //             "allow_instant_ach": true,
        //             "max_margin_multiplier": "4"
        //         },
        //         "user_configurations": {
        //             "fractional_trading": true,
        //             "max_margin_multiplier": "4"
        //         },
        //         "account_number": "744873727",
        //         "status": "ACTIVE",
        //         "crypto_status": "ACTIVE",
        //         "currency": "USD",
        //         "buying_power": "5.92",
        //         "regt_buying_power": "5.92",
        //         "daytrading_buying_power": "0",
        //         "effective_buying_power": "5.92",
        //         "non_marginable_buying_power": "5.92",
        //         "bod_dtbp": "0",
        //         "cash": "5.92",
        //         "accrued_fees": "0",
        //         "portfolio_value": "48.6",
        //         "pattern_day_trader": false,
        //         "trading_blocked": false,
        //         "transfers_blocked": false,
        //         "account_blocked": false,
        //         "created_at": "2022-06-13T14:59:18.318096Z",
        //         "trade_suspended_by_user": false,
        //         "multiplier": "1",
        //         "shorting_enabled": false,
        //         "equity": "48.6",
        //         "last_equity": "48.8014266",
        //         "long_market_value": "42.68",
        //         "short_market_value": "0",
        //         "position_market_value": "42.68",
        //         "initial_margin": "0",
        //         "maintenance_margin": "0",
        //         "last_maintenance_margin": "0",
        //         "sma": "5.92",
        //         "daytrade_count": 0,
        //         "balance_asof": "2024-12-10",
        //         "crypto_tier": 1,
        //         "intraday_adjustments": "0",
        //         "pending_reg_taf_fees": "0"
        //     }
        //
        return this.parseBalance (response);
    }

    parseBalance (response): Balances {
        const result: Dict = { 'info': response };
        const account = this.account ();
        const currencyId = this.safeString (response, 'currency');
        const code = this.safeCurrencyCode (currencyId);
        account['free'] = this.safeString (response, 'cash');
        account['total'] = this.safeString (response, 'equity');
        result[code] = account;
        return this.safeBalance (result);
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let endpoint = '/' + this.implodeParams (path, params);
        let url = this.implodeHostname (this.urls['api'][api[0]]);
        headers = (headers !== undefined) ? headers : {};
        if (api[1] === 'private') {
            this.checkRequiredCredentials ();
            headers['APCA-API-KEY-ID'] = this.apiKey;
            headers['APCA-API-SECRET-KEY'] = this.secret;
        }
        const query = this.omit (params, this.extractParams (path));
        if (Object.keys (query).length) {
            if ((method === 'GET') || (method === 'DELETE')) {
                endpoint += '?' + this.urlencode (query);
            } else {
                body = this.json (query);
                headers['Content-Type'] = 'application/json';
            }
        }
        url = url + endpoint;
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    handleErrors (code: int, reason: string, url: string, method: string, headers: Dict, body: string, response, requestHeaders, requestBody) {
        if (response === undefined) {
            return undefined; // default error handler
        }
        // {
        //     "code": 40110000,
        //     "message": "request is not authorized"
        // }
        const feedback = this.id + ' ' + body;
        const errorCode = this.safeString (response, 'code');
        if (code !== undefined) {
            this.throwExactlyMatchedException (this.exceptions['exact'], errorCode, feedback);
        }
        const message = this.safeValue (response, 'message', undefined);
        if (message !== undefined) {
            this.throwExactlyMatchedException (this.exceptions['exact'], message, feedback);
            this.throwBroadlyMatchedException (this.exceptions['broad'], message, feedback);
            throw new ExchangeError (feedback);
        }
        return undefined;
    }
}
