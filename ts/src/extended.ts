
//  ---------------------------------------------------------------------------

import Exchange from './abstract/extended.js';
import type { Dict, Int, Market, Str, Strings, Ticker, Tickers } from './base/types.js';

//  ---------------------------------------------------------------------------

/**
 * @class extended
 * @augments Exchange
 */
export default class extended extends Exchange {
    describe (): any {
        return this.deepExtend (super.describe (), {
            'id': 'extended',
            'name': 'Extended',
            'countries': [ 'SG' ],
            'version': 'v2',
            'rateLimit': 600, // Default Tier 1,000 requests/minute ≈ 1.67 request per second
            'certified': true,
            'pro': true,
            'has': {
                'CORS': undefined,
                'spot': true,
                'margin': true,
                'swap': true,
                'future': true,
                'option': false,
                'addMargin': true,
                'borrowCrossMargin': true,
                'borrowIsolatedMargin': true,
                'cancelAllOrders': true,
                'cancelOrder': true,
                'cancelOrders': true,
                'closeAllPositions': true,
                'closePosition': true,
                'createConvertTrade': true,
                'createDepositAddress': false,
                'createMarketBuyOrderWithCost': true,
                'createMarketOrderWithCost': false,
                'createMarketSellOrderWithCost': false,
                'createOrder': true,
                'createOrders': true,
                'createOrderWithTakeProfitAndStopLoss': true,
                'createPostOnlyOrder': true,
                'createReduceOnlyOrder': false,
                'createStopLimitOrder': true,
                'createStopLossOrder': true,
                'createStopMarketOrder': true,
                'createStopOrder': true,
                'createTakeProfitOrder': true,
                'createTrailingAmountOrder': false,
                'createTrailingPercentOrder': true,
                'createTriggerOrder': true,
                'editOrder': true,
                'fetchAccounts': false,
                'fetchBalance': true,
                'fetchBorrowInterest': true,
                'fetchBorrowRateHistories': false,
                'fetchBorrowRateHistory': false,
                'fetchCanceledAndClosedOrders': true,
                'fetchCanceledOrders': true,
                'fetchClosedOrders': true,
                'fetchConvertCurrencies': true,
                'fetchConvertQuote': true,
                'fetchConvertTrade': false,
                'fetchConvertTradeHistory': true,
                'fetchCrossBorrowRate': true,
                'fetchCrossBorrowRates': false,
                'fetchCurrencies': true,
                'fetchDeposit': false,
                'fetchDepositAddress': true,
                'fetchDepositAddresses': false,
                'fetchDepositAddressesByNetwork': false,
                'fetchDeposits': true,
                'fetchDepositsWithdrawals': false,
                'fetchDepositWithdrawFee': 'emulated',
                'fetchDepositWithdrawFees': true,
                'fetchFundingHistory': true,
                'fetchFundingInterval': true,
                'fetchFundingIntervals': true,
                'fetchFundingRate': true,
                'fetchFundingRateHistory': true,
                'fetchFundingRates': true,
                'fetchIndexOHLCV': true,
                'fetchIsolatedBorrowRate': true,
                'fetchIsolatedBorrowRates': false,
                'fetchLedger': true,
                'fetchLeverage': true,
                'fetchLeverageTiers': false,
                'fetchLiquidations': false,
                'fetchLongShortRatio': false,
                'fetchLongShortRatioHistory': true,
                'fetchMarginAdjustmentHistory': false,
                'fetchMarginMode': true,
                'fetchMarketLeverageTiers': true,
                'fetchMarkets': true,
                'fetchMarkOHLCV': true,
                'fetchMarkPrice': true,
                'fetchMyLiquidations': true,
                'fetchMyTrades': true,
                'fetchOHLCV': true,
                'fetchOpenInterest': true,
                'fetchOpenInterestHistory': false,
                'fetchOpenOrders': true,
                'fetchOrder': true,
                'fetchOrderBook': true,
                'fetchOrderBooks': false,
                'fetchOrders': false,
                'fetchOrderTrades': false,
                'fetchPosition': true,
                'fetchPositionHistory': 'emulated',
                'fetchPositionMode': false,
                'fetchPositions': true,
                'fetchPositionsHistory': true,
                'fetchPositionsRisk': false,
                'fetchPremiumIndexOHLCV': false,
                'fetchStatus': false,
                'fetchTicker': true,
                'fetchTickers': true,
                'fetchTime': true,
                'fetchTrades': true,
                'fetchTradingFee': true,
                'fetchTradingFees': true,
                'fetchTransactions': false,
                'fetchTransfer': false,
                'fetchTransfers': true,
                'fetchWithdrawAddresses': false,
                'fetchWithdrawal': false,
                'fetchWithdrawals': true,
                'reduceMargin': true,
                'repayCrossMargin': true,
                'repayIsolatedMargin': true,
                'setLeverage': true,
                'setMargin': false,
                'setMarginMode': true,
                'setPositionMode': true,
                'signIn': false,
                'transfer': true,
                'withdraw': true,
            },
            'timeframes': {
                '1m': '1m',
                '3m': '3m',
                '5m': '5m',
                '15m': '15m',
                '30m': '30m',
                '1h': '1h',
                '2h': '2h',
                '4h': '4h',
                '6h': '6h',
                '12h': '12h',
                '1d': '1d',
                '3d': '3d',
                '1w': '1w',
                '1M': '1m',
            },
            'hostname': 'extended.exchange',
            'urls': {
                'logo': '',
                'api': {
                    'rest': 'https://api.starknet.{hostname}',
                },
                'test': {
                    'rest': 'https://api.starknet.sepolia.{hostname}',
                },
                'www': 'https://app.{hostname}',
                'doc': 'https://api.docs.{hostname}',
                'fees': 'https://docs.{hostname}/extended-resources/trading/trading-fees-and-rebates',
                'referral': '',
            },
            'api': {
                'v1': {
                    'public': {
                        'get': [
                            'info/markets',
                            'info/markets/{market}/stats',
                            'info/markets/{market}/orderbook',
                            'info/markets/{market}/trades',
                            'info/candles/{market}/{candleType}',
                            'info/{market}/funding',
                            'info/{market}/open-interests',
                            'info/builder/dashboard',
                        ],
                    },
                    'private': {
                        'get': [],
                    },
                },
            },
            'fees': {
                'taker': this.parseNumber ('0.002'),
                'maker': this.parseNumber ('0.002'),
            },
            'requiredCredentials': {
                'apiKey': true,
                'secret': true,
                'password': true,
            },
            'exceptions': {
                'exact': {
                },
                'broad': {
                },
            },
            'options': {
            },
        });
    }

    /**
     * @method
     * @name extended#fetchMarkets
     * @description retrieves data on all markets for extended
     * @see https://api.docs.extended.exchange/#get-markets
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} an array of objects representing market data
     */
    async fetchMarkets (params = {}): Promise<Market[]> {
        const response = await this.v1PublicGetInfoMarkets (params);
        //
        //     {
        //       "status": "OK",
        //       "data": [
        //         {
        //           "name": "BTC-USD",
        //           "uiName": "BTC-USD",
        //           "category": "Crypto",
        //           "subCategory": "L1",
        //           "assetName": "BTC",
        //           "assetPrecision": 5,
        //           "collateralAssetName": "USD",
        //           "collateralAssetPrecision": 6,
        //           "description": "Bitcoin",
        //           "active": true,
        //           "status": "ACTIVE",
        //           "marketStats": {
        //             "dailyVolume": "231016077.512960",
        //             "dailyVolumeBase": "3025.00058",
        //             "dailyPriceChange": "420",
        //             "dailyPriceChangePercentage": "0.0055",
        //             "dailyLow": "75635",
        //             "dailyHigh": "77399",
        //             "lastPrice": "77259",
        //             "askPrice": "77260",
        //             "bidPrice": "77259",
        //             "markPrice": "77259.680250000004",
        //             "indexPrice": "77299.020412500001",
        //             "fundingRate": "0.000013",
        //             "nextFundingRate": 1777442400000,
        //             "openInterest": "115861923.311902",
        //             "openInterestBase": "1500.40958",
        //             "deleverageLevels": {
        //               "shortPositions": [
        //                 {
        //                   "level": 1,
        //                   "rankingLowerBound": "-815.7788"
        //                 },
        //                 {
        //                   "level": 2,
        //                   "rankingLowerBound": "-2.1328"
        //                 },
        //                 {
        //                   "level": 3,
        //                   "rankingLowerBound": "-0.9297"
        //                 },
        //                 {
        //                   "level": 4,
        //                   "rankingLowerBound": "0.0000"
        //                 }
        //               ],
        //               "longPositions": [
        //                 {
        //                   "level": 1,
        //                   "rankingLowerBound": "-47234.9095"
        //                 },
        //                 {
        //                   "level": 2,
        //                   "rankingLowerBound": "-0.0030"
        //                 },
        //                 {
        //                   "level": 3,
        //                   "rankingLowerBound": "0.0020"
        //                 },
        //                 {
        //                   "level": 4,
        //                   "rankingLowerBound": "0.0033"
        //                 }
        //               ]
        //             }
        //           },
        //           "tradingConfig": {
        //             "minOrderSize": "0.0001",
        //             "minOrderSizeChange": "0.00001",
        //             "minPriceChange": "1",
        //             "maxMarketOrderValue": "3000000",
        //             "maxLimitOrderValue": "15000000",
        //             "maxPositionValue": "60000000",
        //             "maxLeverage": "50.00",
        //             "hourlyFundingRateCap": "0.25",
        //             "maxNumOrders": "200",
        //             "limitPriceCap": "0.05",
        //             "limitPriceFloor": "0.05",
        //             "riskFactorConfig": [
        //               {
        //                 "upperBound": "4000000",
        //                 "riskFactor": "0.02",
        //                 "isAvailableForUsers": true
        //               }
        //             ]
        //           },
        //           "l2Config": {
        //             "type": "STARKX",
        //             "collateralId": "0x1",
        //             "syntheticId": "0x4254432d3600000000000000000000",
        //             "syntheticResolution": 1000000,
        //             "collateralResolution": 1000000
        //           },
        //           "visibleOnUi": true,
        //           "createdAt": 1752829532673
        //         }
        //       ]
        //     }
        //
        const data = this.safeList (response, 'data', []);
        return this.parseMarkets (data);
    }

    parseMarket (market: Dict): Market {
        //
        //     {
        //       "name": "BTC-USD",
        //       "uiName": "BTC-USD",
        //       "category": "Crypto",
        //       "subCategory": "L1",
        //       "assetName": "BTC",
        //       "assetPrecision": 5,
        //       "collateralAssetName": "USD",
        //       "collateralAssetPrecision": 6,
        //       "description": "Bitcoin",
        //       "active": true,
        //       "status": "ACTIVE",
        //       "marketStats": {
        //         "dailyVolume": "231016077.512960",
        //         "dailyVolumeBase": "3025.00058",
        //         "dailyPriceChange": "420",
        //         "dailyPriceChangePercentage": "0.0055",
        //         "dailyLow": "75635",
        //         "dailyHigh": "77399",
        //         "lastPrice": "77259",
        //         "askPrice": "77260",
        //         "bidPrice": "77259",
        //         "markPrice": "77259.680250000004",
        //         "indexPrice": "77299.020412500001",
        //         "fundingRate": "0.000013",
        //         "nextFundingRate": 1777442400000,
        //         "openInterest": "115861923.311902",
        //         "openInterestBase": "1500.40958",
        //         "deleverageLevels": {
        //           "shortPositions": [
        //             {
        //               "level": 1,
        //               "rankingLowerBound": "-815.7788"
        //             },
        //             {
        //               "level": 2,
        //               "rankingLowerBound": "-2.1328"
        //             },
        //             {
        //               "level": 3,
        //               "rankingLowerBound": "-0.9297"
        //             },
        //             {
        //               "level": 4,
        //               "rankingLowerBound": "0.0000"
        //             }
        //           ],
        //           "longPositions": [
        //             {
        //               "level": 1,
        //               "rankingLowerBound": "-47234.9095"
        //             },
        //             {
        //               "level": 2,
        //               "rankingLowerBound": "-0.0030"
        //             },
        //             {
        //               "level": 3,
        //               "rankingLowerBound": "0.0020"
        //             },
        //             {
        //               "level": 4,
        //               "rankingLowerBound": "0.0033"
        //             }
        //           ]
        //         }
        //       },
        //       "tradingConfig": {
        //         "minOrderSize": "0.0001",
        //         "minOrderSizeChange": "0.00001",
        //         "minPriceChange": "1",
        //         "maxMarketOrderValue": "3000000",
        //         "maxLimitOrderValue": "15000000",
        //         "maxPositionValue": "60000000",
        //         "maxLeverage": "50.00",
        //         "hourlyFundingRateCap": "0.25",
        //         "maxNumOrders": "200",
        //         "limitPriceCap": "0.05",
        //         "limitPriceFloor": "0.05",
        //         "riskFactorConfig": [
        //           {
        //             "upperBound": "4000000",
        //             "riskFactor": "0.02",
        //             "isAvailableForUsers": true
        //           }
        //         ]
        //       },
        //       "l2Config": {
        //         "type": "STARKX",
        //         "collateralId": "0x1",
        //         "syntheticId": "0x4254432d3600000000000000000000",
        //         "syntheticResolution": 1000000,
        //         "collateralResolution": 1000000
        //       },
        //       "visibleOnUi": true,
        //       "createdAt": 1752829532673
        //     }
        //
        const tradingConfig = this.safeDict (market, 'tradingConfig', {});
        const marketId = this.safeString (market, 'name');
        const baseId = this.safeString (market, 'assetName');
        const quoteId = this.safeString (market, 'collateralAssetName');
        const base = this.safeCurrencyCode (baseId);
        const quote = this.safeCurrencyCode (quoteId);
        const settleId = 'USDC';
        const settle = this.safeCurrencyCode (settleId);
        const symbol = base + '/' + quote + ':' + settle;
        const status = this.safeString (market, 'status');
        const active = (status === 'ACTIVE');
        const amountPrecision = this.safeNumber (tradingConfig, 'minOrderSizeChange');
        const pricePrecision = this.safeNumber (tradingConfig, 'minPriceChange');
        const maxLeverage = this.safeNumber (tradingConfig, 'maxLeverage');
        const minAmount = this.safeNumber (tradingConfig, 'minOrderSize');
        const maxCost = this.safeNumber (tradingConfig, 'maxLimitOrderValue');
        const created: Int = this.safeInteger (market, 'createdAt');
        return this.safeMarketStructure ({
            'id': marketId,
            'symbol': symbol,
            'base': base,
            'quote': quote,
            'settle': settle,
            'baseId': baseId,
            'quoteId': quoteId,
            'settleId': settleId,
            'type': 'swap',
            'spot': false,
            'margin': false,
            'swap': true,
            'future': false,
            'option': false,
            'active': active,
            'contract': true,
            'linear': true,
            'inverse': false,
            'taker': this.safeNumber (this.fees, 'taker'),
            'maker': this.safeNumber (this.fees, 'maker'),
            'contractSize': this.parseNumber ('1'),
            'expiry': undefined,
            'expiryDatetime': undefined,
            'strike': undefined,
            'optionType': undefined,
            'precision': {
                'amount': amountPrecision,
                'price': pricePrecision,
            },
            'limits': {
                'leverage': {
                    'min': this.parseNumber ('1'),
                    'max': maxLeverage,
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
                    'max': maxCost,
                },
            },
            'created': created,
            'info': market,
        });
    }

    /**
     * @method
     * @name extended#fetchTicker
     * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
     * @see https://api.docs.extended.exchange/#get-market-statistics
     * @param {string} symbol unified symbol of the market to fetch the ticker for
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
     */
    async fetchTicker (symbol: Str, params = {}): Promise<Ticker> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'market': market['id'],
        };
        const response = await this.v1PublicGetInfoMarketsMarketStats (this.extend (request, params));
        //
        //     {
        //       "status": "OK",
        //       "data": {
        //         "dailyVolume": "231216165.666600",
        //         "dailyVolumeBase": "3027.36710",
        //         "dailyPriceChange": "181",
        //         "dailyPriceChangePercentage": "0.0024",
        //         "dailyLow": "75635",
        //         "dailyHigh": "77399",
        //         "lastPrice": "77026",
        //         "askPrice": "77026",
        //         "bidPrice": "77025",
        //         "markPrice": "77006.091897999984",
        //         "indexPrice": "77050.739529925005",
        //         "fundingRate": "0.000012",
        //         "nextFundingRate": 1777446000000,
        //         "openInterest": "114851569.088316",
        //         "openInterestBase": "1491.33012",
        //         "deleverageLevels": {
        //           "shortPositions": [
        //             { "level": 1, "rankingLowerBound": "-784.2884" },
        //             { "level": 2, "rankingLowerBound": "-2.1078" },
        //             { "level": 3, "rankingLowerBound": "-0.8754" },
        //             { "level": 4, "rankingLowerBound": "0.0000" }
        //           ],
        //           "longPositions": [
        //             { "level": 1, "rankingLowerBound": "-47747.2010" },
        //             { "level": 2, "rankingLowerBound": "-0.0131" },
        //             { "level": 3, "rankingLowerBound": "0.0019" },
        //             { "level": 4, "rankingLowerBound": "0.0032" }
        //           ]
        //         }
        //       }
        //     }
        //
        const data = this.safeDict (response, 'data', {});
        return this.parseTicker (data, market);
    }

    /**
     * @method
     * @name extended#fetchTickers
     * @description fetches price tickers for multiple markets, statistical information calculated over the past 24 hours for all markets
     * @see https://api.docs.extended.exchange/#get-markets
     * @param {string[]} [symbols] unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
     */
    async fetchTickers (symbols: Strings = undefined, params = {}): Promise<Tickers> {
        await this.loadMarkets ();
        symbols = this.marketSymbols (symbols);
        const request: Dict = {};
        if (symbols !== undefined) {
            const marketIds = [];
            for (let i = 0; i < symbols.length; i++) {
                const market = this.market (symbols[i]);
                marketIds.push (market['id']);
            }
            request['market'] = marketIds;
        }
        const response = await this.v1PublicGetInfoMarkets (this.extend (request, params));
        //
        //     {
        //       "status": "OK",
        //       "data": [
        //         {
        //           "name": "BTC-USD",
        //           "assetName": "BTC",
        //           "collateralAssetName": "USD",
        //           "marketStats": {
        //             "dailyVolume": "231016077.512960",
        //             ...
        //           },
        //           ...
        //         }
        //       ]
        //     }
        //
        const data = this.safeList (response, 'data', []);
        const tickers: Dict = {};
        for (let i = 0; i < data.length; i++) {
            const marketData = data[i];
            const marketId = this.safeString (marketData, 'name');
            const market = this.safeMarket (marketId);
            const stats = this.safeDict (marketData, 'marketStats', {});
            const ticker = this.parseTicker (stats, market);
            const symbol = ticker['symbol'];
            tickers[symbol] = ticker;
        }
        return this.filterByArrayTickers (tickers, 'symbol', symbols);
    }

    parseTicker (ticker: Dict, market: Market = undefined): Ticker {
        //
        //     {
        //       "dailyVolume": "231216165.666600",
        //       "dailyVolumeBase": "3027.36710",
        //       "dailyPriceChange": "181",
        //       "dailyPriceChangePercentage": "0.0024",
        //       "dailyLow": "75635",
        //       "dailyHigh": "77399",
        //       "lastPrice": "77026",
        //       "askPrice": "77026",
        //       "bidPrice": "77025",
        //       "markPrice": "77006.091897999984",
        //       "indexPrice": "77050.739529925005",
        //       "fundingRate": "0.000012",
        //       "nextFundingRate": 1777446000000,
        //       "openInterest": "114851569.088316",
        //       "openInterestBase": "1491.33012",
        //       "deleverageLevels": {
        //         "shortPositions": [
        //           { "level": 1, "rankingLowerBound": "-784.2884" },
        //           { "level": 2, "rankingLowerBound": "-2.1078" },
        //           { "level": 3, "rankingLowerBound": "-0.8754" },
        //           { "level": 4, "rankingLowerBound": "0.0000" }
        //         ],
        //         "longPositions": [
        //           { "level": 1, "rankingLowerBound": "-47747.2010" },
        //           { "level": 2, "rankingLowerBound": "-0.0131" },
        //           { "level": 3, "rankingLowerBound": "0.0019" },
        //           { "level": 4, "rankingLowerBound": "0.0032" }
        //         ]
        //       }
        //     }
        //
        const symbol = this.safeSymbol (undefined, market);
        const last = this.safeNumber (ticker, 'lastPrice');
        const percentageRaw = this.safeNumber (ticker, 'dailyPriceChangePercentage');
        const percentage = (percentageRaw !== undefined) ? percentageRaw * 100 : undefined;
        return this.safeTicker ({
            'symbol': symbol,
            'timestamp': undefined,
            'datetime': undefined,
            'high': this.safeNumber (ticker, 'dailyHigh'),
            'low': this.safeNumber (ticker, 'dailyLow'),
            'bid': this.safeNumber (ticker, 'bidPrice'),
            'bidVolume': undefined,
            'ask': this.safeNumber (ticker, 'askPrice'),
            'askVolume': undefined,
            'vwap': undefined,
            'open': undefined,
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': this.safeNumber (ticker, 'dailyPriceChange'),
            'percentage': percentage,
            'average': undefined,
            'baseVolume': this.safeNumber (ticker, 'dailyVolumeBase'),
            'quoteVolume': this.safeNumber (ticker, 'dailyVolume'),
            'markPrice': this.safeNumber (ticker, 'markPrice'),
            'indexPrice': this.safeNumber (ticker, 'indexPrice'),
            'info': ticker,
        }, market);
    }

    sign (path, api = 'public', method = 'POST', params = {}, headers = undefined, body = undefined) {
        const version = this.safeString (api, 0);
        const accessibility = this.safeString (api, 1);
        const endpoint = '/' + this.implodeParams (path, params);
        const query = this.omit (params, this.extractParams (path));
        let url = this.implodeHostname (this.urls['api']['rest']);
        if (accessibility === 'private') {
            this.checkRequiredCredentials ();
        }
        if (method === 'POST') {
            headers = {
                'Content-Type': 'application/json',
            };
            body = this.json (params);
        }
        url = url + '/api/' + version + endpoint;
        if ((method === 'GET') && (Object.keys (query).length > 0)) {
            url += '?' + this.urlencodeWithArrayRepeat (query);
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
}
