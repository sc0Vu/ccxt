
//  ---------------------------------------------------------------------------

import Exchange from './abstract/extended.js';
import type { Currencies, Currency, Dict, FundingRateHistory, Int, Market, OHLCV, OpenInterest, OrderBook, Str, Strings, Ticker, Tickers, Trade } from './base/types.js';
import { ArgumentsRequired, BadRequest } from './base/errors.js';
import { TICK_SIZE } from './base/functions/number.js';

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
            'precisionMode': TICK_SIZE,
            'certified': true,
            'pro': true,
            'has': {
                'CORS': undefined,
                'spot': false,
                'margin': false,
                'swap': true,
                'future': false,
                'option': false,
                'addMargin': false,
                'borrowCrossMargin': false,
                'borrowIsolatedMargin': false,
                'cancelAllOrders': false,
                'cancelOrder': false,
                'cancelOrders': false,
                'closeAllPositions': false,
                'closePosition': false,
                'createConvertTrade': false,
                'createDepositAddress': false,
                'createMarketBuyOrderWithCost': false,
                'createMarketOrderWithCost': false,
                'createMarketSellOrderWithCost': false,
                'createOrder': false,
                'createOrders': false,
                'createOrderWithTakeProfitAndStopLoss': false,
                'createPostOnlyOrder': false,
                'createReduceOnlyOrder': false,
                'createStopLimitOrder': false,
                'createStopLossOrder': false,
                'createStopMarketOrder': false,
                'createStopOrder': false,
                'createTakeProfitOrder': false,
                'createTrailingAmountOrder': false,
                'createTrailingPercentOrder': false,
                'createTriggerOrder': false,
                'editOrder': false,
                'fetchAccounts': false,
                'fetchBalance': false,
                'fetchBorrowInterest': false,
                'fetchBorrowRateHistories': false,
                'fetchBorrowRateHistory': false,
                'fetchCanceledAndClosedOrders': false,
                'fetchCanceledOrders': false,
                'fetchClosedOrders': false,
                'fetchConvertCurrencies': false,
                'fetchConvertQuote': false,
                'fetchConvertTrade': false,
                'fetchConvertTradeHistory': false,
                'fetchCrossBorrowRate': false,
                'fetchCrossBorrowRates': false,
                'fetchCurrencies': true,
                'fetchDeposit': false,
                'fetchDepositAddress': false,
                'fetchDepositAddresses': false,
                'fetchDepositAddressesByNetwork': false,
                'fetchDeposits': false,
                'fetchDepositsWithdrawals': false,
                'fetchDepositWithdrawFee': false,
                'fetchDepositWithdrawFees': false,
                'fetchFundingHistory': false,
                'fetchFundingInterval': false,
                'fetchFundingIntervals': false,
                'fetchFundingRate': false,
                'fetchFundingRateHistory': true,
                'fetchFundingRates': false,
                'fetchIndexOHLCV': true,
                'fetchIsolatedBorrowRate': false,
                'fetchIsolatedBorrowRates': false,
                'fetchLedger': false,
                'fetchLeverage': false,
                'fetchLeverageTiers': false,
                'fetchLiquidations': false,
                'fetchLongShortRatio': false,
                'fetchLongShortRatioHistory': false,
                'fetchMarginAdjustmentHistory': false,
                'fetchMarginMode': false,
                'fetchMarketLeverageTiers': false,
                'fetchMarkets': true,
                'fetchMarkOHLCV': true,
                'fetchMarkPrice': false,
                'fetchMyLiquidations': false,
                'fetchMyTrades': false,
                'fetchOHLCV': true,
                'fetchOpenInterest': false,
                'fetchOpenInterestHistory': true,
                'fetchOpenOrders': false,
                'fetchOrder': false,
                'fetchOrderBook': true,
                'fetchOrderBooks': false,
                'fetchOrders': false,
                'fetchOrderTrades': false,
                'fetchPosition': false,
                'fetchPositionHistory': false,
                'fetchPositionMode': false,
                'fetchPositions': false,
                'fetchPositionsHistory': false,
                'fetchPositionsRisk': false,
                'fetchPremiumIndexOHLCV': false,
                'fetchStatus': false,
                'fetchTicker': true,
                'fetchTickers': true,
                'fetchTime': false,
                'fetchTrades': true,
                'fetchTradingFee': false,
                'fetchTradingFees': false,
                'fetchTransactions': false,
                'fetchTransfer': false,
                'fetchTransfers': false,
                'fetchWithdrawAddresses': false,
                'fetchWithdrawal': false,
                'fetchWithdrawals': false,
                'reduceMargin': false,
                'repayCrossMargin': false,
                'repayIsolatedMargin': false,
                'setLeverage': false,
                'setMargin': false,
                'setMarginMode': false,
                'setPositionMode': false,
                'signIn': false,
                'transfer': false,
                'withdraw': false,
            },
            'timeframes': {
                '1m': 'PT1M',
                '5m': 'PT5M',
                '15m': 'PT15M',
                '30m': 'PT30M',
                '1h': 'PT1H',
                '2h': 'PT2H',
                '4h': 'PT4H',
                '8h': 'PT8H',
                '12h': 'PT12H',
                '1d': 'PT24H',
                '1w': 'P7D',
                '1M': 'P30D',
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
                            'info/assets',
                            'info/assets/{asset}/price',
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
        //       "marketStats": { ... },
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
        //       "l2Config": { ... },
        //       "visibleOnUi": true,
        //       "createdAt": 1752829532673
        //     }
        //
        const tradingConfig = this.safeDict (market, 'tradingConfig', {});
        const marketId = this.safeString (market, 'name');
        const baseId = this.safeString (market, 'assetName');
        let quoteId = this.safeString (market, 'collateralAssetName');
        if (quoteId === 'USD') {
            quoteId = 'USDC';
        }
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
     * @name extended#fetchCurrencies
     * @description fetches all available currencies on an exchange
     * @see https://api.docs.extended.exchange/#get-assets
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an associative dictionary of currencies
     */
    async fetchCurrencies (params = {}): Promise<Currencies> {
        const response = await this.v1PublicGetInfoAssets (params);
        //
        //     {
        //       "status": "OK",
        //       "data": [
        //         {
        //           "id": 1,
        //           "name": "USD",
        //           "symbol": "USD",
        //           "description": "USD Collateral",
        //           "precision": 6,
        //           "isActive": true,
        //           "isCollateral": true,
        //           "starkexId": "0x1",
        //           "starkexResolution": 1000000,
        //           "l1Id": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        //           "l1Resolution": 1000000,
        //           "version": 3,
        //           "createdAt": 1752829532673,
        //           "type": "SPOT",
        //           "canBeUsedAsCollateral": true,
        //           "riskFactors": [],
        //           "availableForTradeFactors": []
        //         }
        //       ]
        //     }
        //
        const data = this.safeList (response, 'data', []);
        return this.parseCurrencies (data);
    }

    parseCurrency (currency: Dict): Currency {
        //
        //     {
        //       "id": 1,
        //       "name": "USD",
        //       "symbol": "USD",
        //       "description": "USD Collateral",
        //       "precision": 6,
        //       "isActive": true,
        //       "isCollateral": true,
        //       "starkexId": "0x1",
        //       "starkexResolution": 1000000,
        //       "l1Id": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        //       "l1Resolution": 1000000,
        //       "version": 3,
        //       "createdAt": 1752829532673,
        //       "type": "SPOT",
        //       "canBeUsedAsCollateral": true,
        //       "riskFactors": [],
        //       "availableForTradeFactors": []
        //     }
        //
        const currencyId = this.safeString (currency, 'symbol');
        let code = this.safeCurrencyCode (currencyId);
        if (currencyId === 'USD') {
            code = 'USDC';
        }
        const name = this.safeString (currency, 'name');
        const precision = this.safeInteger (currency, 'precision');
        const isActive = this.safeBool (currency, 'isActive');
        return this.safeCurrencyStructure ({
            'id': currencyId,
            'code': code,
            'numericId': this.safeInteger (currency, 'id'),
            'name': name,
            'active': isActive,
            'deposit': undefined,
            'withdraw': undefined,
            'precision': precision,
            'type': this.safeStringLower (currency, 'type'),
            'margin': this.safeBool (currency, 'canBeUsedAsCollateral'),
            'info': currency,
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

    /**
     * @method
     * @name extended#fetchOrderBook
     * @description fetches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
     * @see https://api.docs.extended.exchange/#get-market-order-book
     * @param {string} symbol unified symbol of the market to fetch the order book for
     * @param {int} [limit] the maximum amount of order book entries to return
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} A dictionary of [order book structures]{@link https://docs.ccxt.com/#/?id=order-book-structure} indexed by market symbols
     */
    async fetchOrderBook (symbol: string, limit: Int = undefined, params = {}): Promise<OrderBook> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'market': market['id'],
        };
        const response = await this.v1PublicGetInfoMarketsMarketOrderbook (this.extend (request, params));
        //
        //     {
        //       "status": "OK",
        //       "data": {
        //         "market": "BTC-USD",
        //         "bid": [
        //           {
        //             "qty": "14.46084",
        //             "price": "76214"
        //           }
        //         ],
        //         "ask": [
        //           {
        //             "qty": "0.11585",
        //             "price": "76215"
        //           }
        //         ]
        //       }
        //     }
        //
        const data = this.safeDict (response, 'data', {});
        const orderbook = this.parseOrderBook (data, market['symbol'], undefined, 'bid', 'ask', 'price', 'qty');
        if (limit !== undefined) {
            orderbook['bids'] = this.arraySlice (orderbook['bids'], 0, limit);
            orderbook['asks'] = this.arraySlice (orderbook['asks'], 0, limit);
        }
        return orderbook;
    }

    /**
     * @method
     * @name extended#fetchTrades
     * @description get the list of most recent trades for a particular symbol
     * @see https://api.docs.extended.exchange/#get-market-last-trades
     * @param {string} symbol unified symbol of the market to fetch trades for
     * @param {int} [since] timestamp in ms of the earliest trade to fetch
     * @param {int} [limit] the maximum amount of trades to fetch
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=public-trades}
     */
    async fetchTrades (symbol: Str, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Trade[]> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'market': market['id'],
        };
        const response = await this.v1PublicGetInfoMarketsMarketTrades (this.extend (request, params));
        //
        //     {
        //       "status": "OK",
        //       "data": [
        //         {
        //           "i": 2.049676905958871e+18,
        //           "m": "BTC-USD",
        //           "S": "SELL",
        //           "tT": "TRADE",
        //           "T": 1777516030193,
        //           "p": "76140",
        //           "q": "0.00165"
        //         }
        //       ]
        //     }
        //
        const data = this.safeList (response, 'data', []);
        return this.parseTrades (data, market, since, limit);
    }

    parseTrade (trade: Dict, market: Market = undefined): Trade {
        //
        //     {
        //       "i": 2.049676905958871e+18,
        //       "m": "BTC-USD",
        //       "S": "SELL",
        //       "tT": "TRADE",
        //       "T": 1777516030193,
        //       "p": "76140",
        //       "q": "0.00165"
        //     }
        //
        const marketId = this.safeString (trade, 'm');
        market = this.safeMarket (marketId, market);
        const timestamp = this.safeInteger (trade, 'T');
        const priceString = this.safeString (trade, 'p');
        const amountString = this.safeString (trade, 'q');
        const sideRaw = this.safeString (trade, 'S');
        const side = (sideRaw !== undefined) ? sideRaw.toLowerCase () : undefined;
        return this.safeTrade ({
            'id': this.safeString (trade, 'i'),
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': market['symbol'],
            'order': undefined,
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
     * @name extended#fetchOHLCV
     * @description fetches historical candlestick data containing the open, high, low, and close price, and the volume of a market
     * @see https://api.docs.extended.exchange/#get-candles-history
     * @param {string} symbol unified symbol of the market to fetch OHLCV data for
     * @param {string} timeframe the length of time each candle represents
     * @param {int} [since] timestamp in ms of the earliest candle to fetch
     * @param {int} [limit] the maximum amount of candles to fetch, default 100
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.candleType] candle type: 'trades' (default), 'mark-prices', or 'index-prices'
     * @param {string} [params.price] *ignored if params.candleType is set* 'mark' or 'index' for mark price and index price candles
     * @param {int} [params.until] end timestamp in ms for the requested period
     * @returns {int[][]} A list of candles ordered as timestamp, open, high, low, close, volume
     */
    async fetchOHLCV (symbol: Str, timeframe = '1m', since: Int = undefined, limit: Int = undefined, params = {}): Promise<OHLCV[]> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const price = this.safeString (params, 'price');
        let candleType = this.safeString (params, 'candleType');
        if (candleType === undefined) {
            if (price === 'mark') {
                candleType = 'mark-prices';
            } else if (price === 'index') {
                candleType = 'index-prices';
            } else {
                candleType = 'trades';
            }
        }
        const until = this.safeInteger (params, 'until');
        params = this.omit (params, [ 'candleType', 'price', 'until' ]);
        const request: Dict = {
            'market': market['id'],
            'candleType': candleType,
            'interval': this.safeString (this.timeframes, timeframe, timeframe),
            'limit': (limit !== undefined) ? limit : 100,
        };
        if (until !== undefined) {
            request['endTime'] = until;
        }
        const response = await this.v1PublicGetInfoCandlesMarketCandleType (this.extend (request, params));
        //
        //     {
        //       "status": "OK",
        //       "data": [
        //         {
        //           "o": "75657.5",
        //           "l": "75657.5",
        //           "h": "75657.5",
        //           "c": "75657.5",
        //           "v": "0",
        //           "T": 1777517880000
        //         }
        //       ]
        //     }
        //
        const data = this.safeList (response, 'data', []);
        return this.parseOHLCVs (data, market, timeframe, since, limit);
    }

    parseOHLCV (ohlcv: Dict, market: Market = undefined): OHLCV {
        //
        //     {
        //       "o": "75657.5",
        //       "l": "75657.5",
        //       "h": "75657.5",
        //       "c": "75657.5",
        //       "v": "0",
        //       "T": 1777517880000
        //     }
        //
        return [
            this.safeInteger (ohlcv, 'T'),
            this.safeNumber (ohlcv, 'o'),
            this.safeNumber (ohlcv, 'h'),
            this.safeNumber (ohlcv, 'l'),
            this.safeNumber (ohlcv, 'c'),
            this.safeNumber (ohlcv, 'v'),
        ];
    }

    /**
     * @method
     * @name extended#fetchFundingRateHistory
     * @description fetches historical funding rate prices
     * @see https://api.docs.extended.exchange/#get-funding-rates-history
     * @param {string} symbol unified symbol of the market to fetch funding rate history for
     * @param {int} [since] timestamp in ms of the earliest funding rate to fetch
     * @param {int} [limit] the maximum amount of entries to fetch
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.until] timestamp in ms of the latest funding rate to fetch
     * @param {int} [params.endTime] exchange-specific end timestamp in ms of the latest funding rate to fetch
     * @param {int} [params.cursor] offset of the result set
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [available parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @returns {object[]} a list of [funding rate structures]{@link https://docs.ccxt.com/#/?id=funding-rate-history-structure}
     */
    async fetchFundingRateHistory (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<FundingRateHistory[]> {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchFundingRateHistory() requires a symbol argument');
        }
        await this.loadMarkets ();
        let paginate = false;
        [ paginate, params ] = this.handleOptionAndParams (params, 'fetchFundingRateHistory', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallCursor ('fetchFundingRateHistory', symbol, since, limit, params, 'cursor', 'cursor', undefined, 10000) as FundingRateHistory[];
        }
        const market = this.market (symbol);
        symbol = market['symbol'];
        if (limit === undefined) {
            limit = 100;
        }
        const until = this.safeInteger (params, 'until', this.milliseconds ());
        const endTime = this.safeInteger (params, 'endTime', until);
        params = this.omit (params, [ 'endTime', 'until' ]);
        if (since === undefined) {
            since = endTime - (limit * 60 * 60 * 1000);
        }
        const request: Dict = {
            'market': market['id'],
            'startTime': since,
            'endTime': endTime,
            'limit': limit,
        };
        const response = await this.v1PublicGetInfoMarketFunding (this.extend (request, params));
        //
        //     {
        //       "status": "OK",
        //       "data": [
        //         {
        //           "m": "BTC-USD",
        //           "f": "0.000008",
        //           "T": 1777507201028
        //         }
        //       ],
        //       "pagination": {
        //         "cursor": 1784963886257016832,
        //         "count": 1
        //       }
        //     }
        //
        const data = this.safeList (response, 'data', []);
        const pagination = this.safeDict (response, 'pagination', {});
        const cursor = this.safeValue (pagination, 'cursor');
        const result: FundingRateHistory[] = [];
        for (let i = 0; i < data.length; i++) {
            let entry = data[i];
            if ((cursor !== undefined) && (i === data.length - 1)) {
                entry = this.extend (entry, { 'cursor': cursor });
            }
            result.push (this.parseFundingRateHistory (entry, market));
        }
        const sorted = this.sortBy (result, 'timestamp');
        return this.filterBySymbolSinceLimit (sorted, symbol, since, limit) as FundingRateHistory[];
    }

    parseFundingRateHistory (info: Dict, market: Market = undefined): FundingRateHistory {
        //
        //     {
        //       "m": "BTC-USD",
        //       "f": "0.000008",
        //       "T": 1777507201028
        //     }
        //
        const marketId = this.safeString (info, 'm');
        market = this.safeMarket (marketId, market);
        const timestamp = this.safeInteger (info, 'T');
        return {
            'info': info,
            'symbol': market['symbol'],
            'fundingRate': this.safeNumber (info, 'f'),
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
        } as FundingRateHistory;
    }

    /**
     * @method
     * @name extended#fetchOpenInterestHistory
     * @description Retrieves the open interest history of a currency
     * @see https://api.docs.extended.exchange/#get-open-interest-history
     * @param {string} symbol unified CCXT market symbol
     * @param {string} timeframe '1h' or '1d'
     * @param {int} [since] the time(ms) of the earliest record to retrieve as a unix timestamp
     * @param {int} [limit] the maximum amount of open interest structures to retrieve
     * @param {object} [params] exchange specific parameters
     * @param {int} [params.until] timestamp in ms of the latest open interest record to fetch
     * @returns {object[]} an array of [open interest structures]{@link https://docs.ccxt.com/#/?id=open-interest-structure}
     */
    async fetchOpenInterestHistory (symbol: string, timeframe = '1h', since: Int = undefined, limit: Int = undefined, params = {}): Promise<OpenInterest[]> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const interval = this.safeString (this.timeframes, timeframe);
        if (!this.inArray (interval, [ 'PT1H', 'P1D' ])) {
            throw new BadRequest (this.id + ' fetchOpenInterestHistory() supports 1h and 1d timeframes only');
        }
        if (limit === undefined) {
            limit = 100;
        }
        const until = this.safeInteger (params, 'until', this.milliseconds ());
        const endTime = this.safeInteger (params, 'endTime', until);
        params = this.omit (params, [ 'endTime', 'until' ]);
        if (since === undefined) {
            since = endTime - (limit * this.parseTimeframe (timeframe) * 1000);
        }
        const request: Dict = {
            'market': market['id'],
            'interval': interval,
            'startTime': since,
            'endTime': endTime,
            'limit': limit,
        };
        const response = await this.v1PublicGetInfoMarketOpenInterests (this.extend (request, params));
        //
        //     {
        //       "status": "OK",
        //       "data": [
        //         {
        //           "i": "112620590.6060360000000000",
        //           "I": "1473.1408400000000000",
        //           "t": 1777420800000
        //         }
        //       ]
        //     }
        //
        const data = this.safeList (response, 'data', []);
        return this.parseOpenInterestsHistory (data, market, since, limit);
    }

    parseOpenInterest (interest: Dict, market: Market = undefined): OpenInterest {
        //
        //     {
        //       "i": "112620590.6060360000000000",
        //       "I": "1473.1408400000000000",
        //       "t": 1777420800000
        //     }
        //
        const timestamp = this.safeInteger (interest, 't');
        return this.safeOpenInterest ({
            'symbol': market['symbol'],
            'openInterestAmount': this.safeNumber (interest, 'I'),
            'openInterestValue': this.safeNumber (interest, 'i'),
            'baseVolume': this.safeNumber (interest, 'I'),
            'quoteVolume': this.safeNumber (interest, 'i'),
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'info': interest,
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
