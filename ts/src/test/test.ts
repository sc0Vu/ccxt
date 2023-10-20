// ----------------------------------------------------------------------------

import fs from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import ccxt from '../../ccxt.js';
import errorsHierarchy from '../base/errorHierarchy.js';


// js specific codes //
const DIR_NAME = fileURLToPath (new URL ('.', import.meta.url));
process.on ('uncaughtException', (e) => {
    exceptionMessage (e); process.exit (1);
});
process.on ('unhandledRejection', (e: any) => {
    exceptionMessage (e); process.exit (1);
});
const [ processPath, , exchangeIdFromArgv = null, exchangeSymbol = undefined ] = process.argv.filter ((x) => !x.startsWith ('--'));
const AuthenticationError = ccxt.AuthenticationError;
const RateLimitExceeded = ccxt.RateLimitExceeded;
const ExchangeNotAvailable = ccxt.ExchangeNotAvailable;
const NetworkError = ccxt.NetworkError;
const DDoSProtection = ccxt.DDoSProtection;
const OnMaintenance = ccxt.OnMaintenance;
const RequestTimeout = ccxt.RequestTimeout;
const NotSupported = ccxt.NotSupported;

// non-transpiled part, but shared names among langs
class baseMainTestClass {
    info = false;
    verbose = false;
    debug = false;
    privateTest = false;
    privateTestOnly = false;
    sandbox = false;
    skippedMethods = {};
    checkedPublicTests = {};
    testFiles = {};
    publicTests = {};
}
const rootDir = DIR_NAME + '/../../../';
const rootDirForSkips = DIR_NAME + '/../../../';
const envVars = process.env;
const LOG_CHARS_LENGTH = 10000;
const ext = import.meta.url.split ('.')[1];

function dump (...args) {
    console.log (...args);
}

function getCliArgValue (arg) {
    return process.argv.includes (arg) || false;
}

function getTestName (str) {
    return str;
}

function ioFileExists (path) {
    return fs.existsSync (path);
}

function ioFileRead (path, decode = true) {
    const content = fs.readFileSync (path, 'utf8');
    return decode ? JSON.parse (content) : content;
}

async function callMethod (testFiles, methodName, exchange, skippedProperties, args) {
    return await testFiles[methodName] (exchange, skippedProperties, ...args);
}

function exceptionMessage (exc) {
    return '[' + exc.constructor.name + '] ' + exc.stack.slice (0, LOG_CHARS_LENGTH);
}

function exitScript () {
    process.exit (0);
}

function getExchangeProp (exchange, prop, defaultValue = undefined) {
    return (prop in exchange) ? exchange[prop] : defaultValue;
}

function setExchangeProp (exchange, prop, value) {
    exchange[prop] = value;
}

function initExchange (exchangeId, args) {
    return new (ccxt)[exchangeId] (args);
}

async function importTestFile (filePath) {
    // eslint-disable-next-line global-require, import/no-dynamic-require, no-path-concat
    return (await import (pathToFileURL (filePath + '.js') as any) as any)['default'];
}

async function setTestFiles (holderClass, properties) {
    // exchange tests
    for (let i = 0; i < properties.length; i++) {
        const name = properties[i];
        const filePathWoExt = DIR_NAME + '/Exchange/test.' + name;
        if (ioFileExists (filePathWoExt + '.' + ext)) {
            // eslint-disable-next-line global-require, import/no-dynamic-require, no-path-concat
            holderClass.testFiles[name] = await importTestFile (filePathWoExt);
        }
    }
    // errors tests
    const errorHierarchyKeys = Object.keys (errorsHierarchy);
    for (let i = 0; i < errorHierarchyKeys.length; i++) {
        const name = errorHierarchyKeys[i];
        const filePathWoExt = DIR_NAME + '/base/errors/test.' + name;
        if (ioFileExists (filePathWoExt + '.' + ext)) {
            // eslint-disable-next-line global-require, import/no-dynamic-require, no-path-concat
            holderClass.testFiles[name] = await importTestFile (filePathWoExt);
        }
    }
}

async function close (exchange) {
    // stub
}

// *********************************
// ***** AUTO-TRANSPILER-START *****

export default class testMainClass extends baseMainTestClass {
    parseCliArgs () {
        this.info = getCliArgValue ('--info');
        this.verbose = getCliArgValue ('--verbose');
        this.debug = getCliArgValue ('--debug');
        this.privateTest = getCliArgValue ('--private');
        this.privateTestOnly = getCliArgValue ('--privateOnly');
        this.sandbox = getCliArgValue ('--sandbox');
    }

    async init (exchangeId, symbol) {
        this.parseCliArgs ();
        const symbolStr = symbol !== undefined ? symbol : 'all';
        dump ('\nTESTING ', ext, { 'exchange': exchangeId, 'symbol': symbolStr }, '\n');
        const exchangeArgs = {
            'verbose': this.verbose,
            'debug': this.debug,
            'enableRateLimit': true,
            'timeout': 30000,
        };
        const exchange = initExchange (exchangeId, exchangeArgs);
        await this.importFiles (exchange);
        this.expandSettings (exchange, symbol);
        await this.startTest (exchange, symbol);
    }

    async importFiles (exchange) {
        // exchange tests
        this.testFiles = {};
        const properties = Object.keys (exchange.has);
        properties.push ('loadMarkets');
        await setTestFiles (this, properties);
    }

    expandSettings (exchange, symbol) {
        const exchangeId = exchange.id;
        const keysGlobal = rootDir + 'keys.json';
        const keysLocal = rootDir + 'keys.local.json';
        const keysGlobalExists = ioFileExists (keysGlobal);
        const keysLocalExists = ioFileExists (keysLocal);
        const globalSettings = keysGlobalExists ? ioFileRead (keysGlobal) : {};
        const localSettings = keysLocalExists ? ioFileRead (keysLocal) : {};
        const allSettings = exchange.deepExtend (globalSettings, localSettings);
        const exchangeSettings = exchange.safeValue (allSettings, exchangeId, {});
        if (exchangeSettings) {
            const settingKeys = Object.keys (exchangeSettings);
            for (let i = 0; i < settingKeys.length; i++) {
                const key = settingKeys[i];
                if (exchangeSettings[key]) {
                    let finalValue = undefined;
                    if (typeof exchangeSettings[key] === 'object') {
                        const existing = getExchangeProp (exchange, key, {});
                        finalValue = exchange.deepExtend (existing, exchangeSettings[key]);
                    } else {
                        finalValue = exchangeSettings[key];
                    }
                    setExchangeProp (exchange, key, finalValue);
                }
            }
        }
        // credentials
        const reqCreds = getExchangeProp (exchange, 're' + 'quiredCredentials'); // dont glue the r-e-q-u-i-r-e phrase, because leads to messed up transpilation
        const objkeys = Object.keys (reqCreds);
        for (let i = 0; i < objkeys.length; i++) {
            const credential = objkeys[i];
            const isRequired = reqCreds[credential];
            if (isRequired && getExchangeProp (exchange, credential) === undefined) {
                const fullKey = exchangeId + '_' + credential;
                const credentialEnvName = fullKey.toUpperCase (); // example: KRAKEN_APIKEY
                const credentialValue = (credentialEnvName in envVars) ? envVars[credentialEnvName] : undefined;
                if (credentialValue) {
                    setExchangeProp (exchange, credential, credentialValue);
                }
            }
        }
        // skipped tests
        const skippedFile = rootDirForSkips + 'skip-tests.json';
        const skippedSettings = ioFileRead (skippedFile);
        const skippedSettingsForExchange = exchange.safeValue (skippedSettings, exchangeId, {});
        // others
        const timeout = exchange.safeValue (skippedSettingsForExchange, 'timeout');
        if (timeout !== undefined) {
            exchange.timeout = timeout;
        }
        exchange.httpsProxy = exchange.safeString (skippedSettingsForExchange, 'httpsProxy');
        this.skippedMethods = exchange.safeValue (skippedSettingsForExchange, 'skipMethods', {});
        this.checkedPublicTests = {};
    }

    addPadding (message, size) {
        // has to be transpilable
        let res = '';
        const missingSpace = size - message.length - 0; // - 0 is added just to trick transpile to treat the .length as a string for php
        if (missingSpace > 0) {
            for (let i = 0; i < missingSpace; i++) {
                res += ' ';
            }
        }
        return message + res;
    }

    async testMethod (methodName, exchange, args, isPublic) {
        const isLoadMarkets = (methodName === 'loadMarkets');
        const methodNameInTest = getTestName (methodName);
        // if this is a private test, and the implementation was already tested in public, then no need to re-test it in private test (exception is fetchCurrencies, because our approach in base exchange)
        if (!isPublic && (methodNameInTest in this.checkedPublicTests) && (methodName !== 'fetchCurrencies')) {
            return;
        }
        let skipMessage = undefined;
        if (!isLoadMarkets && (!(methodName in exchange.has) || !exchange.has[methodName])) {
            skipMessage = '[INFO:UNSUPPORTED_TEST]'; // keep it aligned with the longest message
        } else if ((methodName in this.skippedMethods) && (typeof this.skippedMethods[methodName] === 'string')) {
            skipMessage = '[INFO:SKIPPED_TEST]';
        } else if (!(methodNameInTest in this.testFiles)) {
            skipMessage = '[INFO:UNIMPLEMENTED_TEST]';
        }
        // exceptionally for `loadMarkets` call, we call it before it's even checked for "skip" as we need it to be called anyway (but can skip "test.loadMarket" for it)
        if (isLoadMarkets) {
            await exchange.loadMarkets (true);
        }
        if (skipMessage) {
            if (this.info) {
                dump (this.addPadding (skipMessage, 25), exchange.id, methodNameInTest);
            }
            return;
        }
        if (this.info) {
            const argsStringified = '(' + args.join (',') + ')';
            dump (this.addPadding ('[INFO:TESTING]', 25), exchange.id, methodNameInTest, argsStringified);
        }
        const skippedProperties = exchange.safeValue (this.skippedMethods, methodName, {});
        await callMethod (this.testFiles, methodNameInTest, exchange, skippedProperties, args);
        // if it was passed successfully, add to the list of successfull tests
        if (isPublic) {
            this.checkedPublicTests[methodNameInTest] = true;
        }
    }

    async testSafe (methodName, exchange, args = [], isPublic = false) {
        // `testSafe` method does not throw an exception, instead mutes it.
        // The reason we mute the thrown exceptions here is because if this test is part
        // of "runPublicTests", then we don't want to stop the whole test if any single
        // test-method fails. For example, if "fetchOrderBook" public test fails, we still
        // want to run "fetchTickers" and other methods. However, independently this fact,
        // from those test-methods we still echo-out (console.log/print...) the exception
        // messages with specific formatted message "[TEST_FAILURE] ..." and that output is
        // then regex-parsed by run-tests.js, so the exceptions are still printed out to
        // console from there. So, even if some public tests fail, the script will continue
        // doing other things (testing other spot/swap or private tests ...)
        const maxRetries = 3;
        const argsStringified = exchange.json (args); // args.join() breaks when we provide a list of symbols | "args.toString()" breaks bcz of "array to string conversion"
        for (let i = 0; i < maxRetries; i++) {
            try {
                await this.testMethod (methodName, exchange, args, isPublic);
                return true;
            } catch (e) {
                const isAuthError = (e instanceof AuthenticationError);
                const isRateLimitExceeded = (e instanceof RateLimitExceeded);
                const isNetworkError = (e instanceof NetworkError);
                const isDDoSProtection = (e instanceof DDoSProtection);
                const isRequestTimeout = (e instanceof RequestTimeout);
                const isNotSupported = (e instanceof NotSupported);
                const tempFailure = (isRateLimitExceeded || isNetworkError || isDDoSProtection || isRequestTimeout);
                if (tempFailure) {
                    // if last retry was gone with same `tempFailure` error, then let's eventually return false
                    if (i === maxRetries - 1) {
                        dump ('[TEST_WARNING]', 'Method could not be tested due to a repeated Network/Availability issues', ' | ', exchange.id, methodName, argsStringified);
                    } else {
                        // wait and retry again
                        await exchange.sleep (i * 1000); // increase wait seconds on every retry
                        continue;
                    }
                } else if (e instanceof OnMaintenance) {
                    // in case of maintenance, skip exchange (don't fail the test)
                    dump ('[TEST_WARNING] Exchange is on maintenance', exchange.id);
                }
                // If public test faces authentication error, we don't break (see comments under `testSafe` method)
                else if (isPublic && isAuthError) {
                    // in case of loadMarkets, it means that "tester" (developer or travis) does not have correct authentication, so it does not have a point to proceed at all
                    if (methodName === 'loadMarkets') {
                        dump ('[TEST_WARNING]', 'Exchange can not be tested, because of authentication problems during loadMarkets', exceptionMessage (e), exchange.id, methodName, argsStringified);
                    }
                    if (this.info) {
                        dump ('[TEST_WARNING]', 'Authentication problem for public method', exceptionMessage (e), exchange.id, methodName, argsStringified);
                    }
                } else {
                    // if not a temporary connectivity issue, then mark test as failed (no need to re-try)
                    if (isNotSupported) {
                        dump ('[NOT_SUPPORTED]', exchange.id, methodName, argsStringified);
                        return true; // why consider not supported as a failed test?
                    } else {
                        dump ('[TEST_FAILURE]', exceptionMessage (e), exchange.id, methodName, argsStringified);
                    }
                }
                return false;
            }
        }
    }

    async runPublicTests (exchange, symbol) {
        const tests = {
            'fetchCurrencies': [],
            'fetchTicker': [ symbol ],
            'fetchTickers': [ symbol ],
            'fetchOHLCV': [ symbol ],
            'fetchTrades': [ symbol ],
            'fetchOrderBook': [ symbol ],
            'fetchL2OrderBook': [ symbol ],
            'fetchOrderBooks': [],
            'fetchBidsAsks': [],
            'fetchStatus': [],
            'fetchTime': [],
        };
        const market = exchange.market (symbol);
        const isSpot = market['spot'];
        if (isSpot) {
            tests['fetchCurrencies'] = [];
        } else {
            tests['fetchFundingRates'] = [ symbol ];
            tests['fetchFundingRate'] = [ symbol ];
            tests['fetchFundingRateHistory'] = [ symbol ];
            tests['fetchIndexOHLCV'] = [ symbol ];
            tests['fetchMarkOHLCV'] = [ symbol ];
            tests['fetchPremiumIndexOHLCV'] = [ symbol ];
        }
        this.publicTests = tests;
        const testNames = Object.keys (tests);
        const promises = [];
        for (let i = 0; i < testNames.length; i++) {
            const testName = testNames[i];
            const testArgs = tests[testName];
            promises.push (this.testSafe (testName, exchange, testArgs, true));
        }
        // todo - not yet ready in other langs too
        // promises.push (testThrottle ());
        const results = await Promise.all (promises);
        // now count which test-methods retuned `false` from "testSafe" and dump that info below
        if (this.info) {
            const errors = [];
            for (let i = 0; i < testNames.length; i++) {
                if (!results[i]) {
                    errors.push (testNames[i]);
                }
            }
            // we don't throw exception for public-tests, see comments under 'testSafe' method
            let failedMsg = '';
            const errorsLength = errors.length;
            if (errorsLength > 0) {
                failedMsg = ' | Failed methods : ' + errors.join (', ');
            }
            dump (this.addPadding ('[INFO:PUBLIC_TESTS_END] ' + market['type'] + failedMsg, 25), exchange.id);
        }
    }

    async loadExchange (exchange) {
        const result = await this.testSafe ('loadMarkets', exchange, [], true);
        if (!result) {
            return false;
        }
        const symbols = [
            'BTC/CNY',
            'BTC/USD',
            'BTC/USDT',
            'BTC/EUR',
            'BTC/ETH',
            'ETH/BTC',
            'BTC/JPY',
            'ETH/EUR',
            'ETH/JPY',
            'ETH/CNY',
            'ETH/USD',
            'LTC/CNY',
            'DASH/BTC',
            'DOGE/BTC',
            'BTC/AUD',
            'BTC/PLN',
            'USD/SLL',
            'BTC/RUB',
            'BTC/UAH',
            'LTC/BTC',
            'EUR/USD',
        ];
        const resultSymbols = [];
        const exchangeSpecificSymbols = exchange.symbols;
        for (let i = 0; i < exchangeSpecificSymbols.length; i++) {
            const symbol = exchangeSpecificSymbols[i];
            if (exchange.inArray (symbol, symbols)) {
                resultSymbols.push (symbol);
            }
        }
        let resultMsg = '';
        const resultLength = resultSymbols.length;
        const exchangeSymbolsLength = exchange.symbols.length;
        if (resultLength > 0) {
            if (exchangeSymbolsLength > resultLength) {
                resultMsg = resultSymbols.join (', ') + ' + more...';
            } else {
                resultMsg = resultSymbols.join (', ');
            }
        }
        dump ('Exchange loaded', exchangeSymbolsLength, 'symbols', resultMsg);
        return true;
    }

    getTestSymbol (exchange, isSpot, symbols) {
        let symbol = undefined;
        for (let i = 0; i < symbols.length; i++) {
            const s = symbols[i];
            const market = exchange.safeValue (exchange.markets, s);
            if (market !== undefined) {
                const active = exchange.safeValue (market, 'active');
                if (active || (active === undefined)) {
                    symbol = s;
                    break;
                }
            }
        }
        return symbol;
    }

    getExchangeCode (exchange, codes = undefined) {
        if (codes === undefined) {
            codes = [ 'BTC', 'ETH', 'XRP', 'LTC', 'BCH', 'EOS', 'BNB', 'BSV', 'USDT' ];
        }
        const code = codes[0];
        for (let i = 0; i < codes.length; i++) {
            if (codes[i] in exchange.currencies) {
                return codes[i];
            }
        }
        return code;
    }

    getMarketsFromExchange (exchange, spot = true) {
        const res = {};
        const markets = exchange.markets;
        const keys = Object.keys (markets);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const market = markets[key];
            if (spot && market['spot']) {
                res[market['symbol']] = market;
            } else if (!spot && !market['spot']) {
                res[market['symbol']] = market;
            }
        }
        return res;
    }

    getValidSymbol (exchange, spot = true) {
        const currentTypeMarkets = this.getMarketsFromExchange (exchange, spot);
        const codes = [
            'BTC',
            'ETH',
            'XRP',
            'LTC',
            'BCH',
            'EOS',
            'BNB',
            'BSV',
            'USDT',
            'ATOM',
            'BAT',
            'BTG',
            'DASH',
            'DOGE',
            'ETC',
            'IOTA',
            'LSK',
            'MKR',
            'NEO',
            'PAX',
            'QTUM',
            'TRX',
            'TUSD',
            'USD',
            'USDC',
            'WAVES',
            'XEM',
            'XMR',
            'ZEC',
            'ZRX',
        ];
        const spotSymbols = [
            'BTC/USD',
            'BTC/USDT',
            'BTC/CNY',
            'BTC/EUR',
            'BTC/ETH',
            'ETH/BTC',
            'ETH/USD',
            'ETH/USDT',
            'BTC/JPY',
            'LTC/BTC',
            'ZRX/WETH',
            'EUR/USD',
        ];
        const swapSymbols = [
            'BTC/USDT:USDT',
            'BTC/USD:USD',
            'ETH/USDT:USDT',
            'ETH/USD:USD',
            'LTC/USDT:USDT',
            'DOGE/USDT:USDT',
            'ADA/USDT:USDT',
            'BTC/USD:BTC',
            'ETH/USD:ETH',
        ];
        const targetSymbols = spot ? spotSymbols : swapSymbols;
        let symbol = this.getTestSymbol (exchange, spot, targetSymbols);
        // if symbols wasn't found from above hardcoded list, then try to locate any symbol which has our target hardcoded 'base' code
        if (symbol === undefined) {
            for (let i = 0; i < codes.length; i++) {
                const currentCode = codes[i];
                const marketsArrayForCurrentCode = exchange.filterBy (currentTypeMarkets, 'base', currentCode);
                const indexedMkts = exchange.indexBy (marketsArrayForCurrentCode, 'symbol');
                const symbolsArrayForCurrentCode = Object.keys (indexedMkts);
                const symbolsLength = symbolsArrayForCurrentCode.length;
                if (symbolsLength) {
                    symbol = this.getTestSymbol (exchange, spot, symbolsArrayForCurrentCode);
                    break;
                }
            }
        }
        // if there wasn't found any symbol with our hardcoded 'base' code, then just try to find symbols that are 'active'
        if (symbol === undefined) {
            const activeMarkets = exchange.filterBy (currentTypeMarkets, 'active', true);
            const activeSymbols = [];
            for (let i = 0; i < activeMarkets.length; i++) {
                activeSymbols.push (activeMarkets[i]['symbol']);
            }
            symbol = this.getTestSymbol (exchange, spot, activeSymbols);
        }
        if (symbol === undefined) {
            const values = Object.values (currentTypeMarkets);
            const valuesLength = values.length;
            if (valuesLength > 0) {
                const first = values[0];
                if (first !== undefined) {
                    symbol = first['symbol'];
                }
            }
        }
        return symbol;
    }

    async testExchange (exchange, providedSymbol = undefined) {
        let spotSymbol = undefined;
        let swapSymbol = undefined;
        if (providedSymbol !== undefined) {
            const market = exchange.market (providedSymbol);
            if (market['spot']) {
                spotSymbol = providedSymbol;
            } else {
                swapSymbol = providedSymbol;
            }
        } else {
            if (exchange.has['spot']) {
                spotSymbol = this.getValidSymbol (exchange, true);
            }
            if (exchange.has['swap']) {
                swapSymbol = this.getValidSymbol (exchange, false);
            }
        }
        if (spotSymbol !== undefined) {
            dump ('Selected SPOT SYMBOL:', spotSymbol);
        }
        if (swapSymbol !== undefined) {
            dump ('Selected SWAP SYMBOL:', swapSymbol);
        }
        if (!this.privateTestOnly) {
            if (exchange.has['spot'] && spotSymbol !== undefined) {
                if (this.info) {
                    dump ('[INFO:SPOT TESTS]');
                }
                exchange.options['type'] = 'spot';
                await this.runPublicTests (exchange, spotSymbol);
            }
            if (exchange.has['swap'] && swapSymbol !== undefined) {
                if (this.info) {
                    dump ('[INFO:SWAP TESTS]');
                }
                exchange.options['type'] = 'swap';
                await this.runPublicTests (exchange, swapSymbol);
            }
        }
        if (this.privateTest || this.privateTestOnly) {
            if (exchange.has['spot'] && spotSymbol !== undefined) {
                exchange.options['defaultType'] = 'spot';
                await this.runPrivateTests (exchange, spotSymbol);
            }
            if (exchange.has['swap'] && swapSymbol !== undefined) {
                exchange.options['defaultType'] = 'swap';
                await this.runPrivateTests (exchange, swapSymbol);
            }
        }
    }

    async runPrivateTests (exchange, symbol) {
        if (!exchange.checkRequiredCredentials (false)) {
            dump ('[Skipping private tests]', 'Keys not found');
            return;
        }
        const code = this.getExchangeCode (exchange);
        // if (exchange.extendedTest) {
        //     await test ('InvalidNonce', exchange, symbol);
        //     await test ('OrderNotFound', exchange, symbol);
        //     await test ('InvalidOrder', exchange, symbol);
        //     await test ('InsufficientFunds', exchange, symbol, balance); // danger zone - won't execute with non-empty balance
        // }
        const tests = {
            'signIn': [ ],
            'fetchBalance': [ ],
            'fetchAccounts': [ ],
            'fetchTransactionFees': [ ],
            'fetchTradingFees': [ ],
            'fetchStatus': [ ],
            'fetchOrders': [ symbol ],
            'fetchOpenOrders': [ symbol ],
            'fetchClosedOrders': [ symbol ],
            'fetchMyTrades': [ symbol ],
            'fetchLeverageTiers': [ [ symbol ] ],
            'fetchLedger': [ code ],
            'fetchTransactions': [ code ],
            'fetchDeposits': [ code ],
            'fetchWithdrawals': [ code ],
            'fetchBorrowRates': [ ],
            'fetchBorrowRate': [ code ],
            'fetchBorrowInterest': [ code, symbol ],
            // 'addMargin': [ ],
            // 'reduceMargin': [ ],
            // 'setMargin': [ ],
            // 'setMarginMode': [ ],
            // 'setLeverage': [ ],
            'cancelAllOrders': [ symbol ],
            // 'cancelOrder': [ ],
            // 'cancelOrders': [ ],
            'fetchCanceledOrders': [ symbol ],
            // 'fetchClosedOrder': [ ],
            // 'fetchOpenOrder': [ ],
            // 'fetchOrder': [ ],
            // 'fetchOrderTrades': [ ],
            'fetchPosition': [ symbol ],
            'fetchDeposit': [ code ],
            'createDepositAddress': [ code ],
            'fetchDepositAddress': [ code ],
            'fetchDepositAddresses': [ code ],
            'fetchDepositAddressesByNetwork': [ code ],
            // 'editOrder': [ ],
            'fetchBorrowRateHistory': [ code ],
            'fetchBorrowRatesPerSymbol': [ ],
            'fetchLedgerEntry': [ code ],
            // 'fetchWithdrawal': [ ],
            // 'transfer': [ ],
            // 'withdraw': [ ],
        };
        const market = exchange.market (symbol);
        const isSpot = market['spot'];
        if (isSpot) {
            tests['fetchCurrencies'] = [ ];
        } else {
            // derivatives only
            tests['fetchPositions'] = [ symbol ]; // this test fetches all positions for 1 symbol
            tests['fetchPosition'] = [ symbol ];
            tests['fetchPositionRisk'] = [ symbol ];
            tests['setPositionMode'] = [ symbol ];
            tests['setMarginMode'] = [ symbol ];
            tests['fetchOpenInterestHistory'] = [ symbol ];
            tests['fetchFundingRateHistory'] = [ symbol ];
            tests['fetchFundingHistory'] = [ symbol ];
        }
        const combinedPublicPrivateTests = exchange.deepExtend (this.publicTests, tests);
        const testNames = Object.keys (combinedPublicPrivateTests);
        const promises = [];
        for (let i = 0; i < testNames.length; i++) {
            const testName = testNames[i];
            const testArgs = combinedPublicPrivateTests[testName];
            promises.push (this.testSafe (testName, exchange, testArgs, false));
        }
        const results = await Promise.all (promises);
        const errors = [];
        for (let i = 0; i < testNames.length; i++) {
            const testName = testNames[i];
            const success = results[i];
            if (!success) {
                errors.push (testName);
            }
        }
        const errorsCnt = errors.length; // PHP transpile count($errors)
        if (errorsCnt > 0) {
            // throw new Error ('Failed private tests [' + market['type'] + ']: ' + errors.join (', '));
            dump ('[TEST_FAILURE]', 'Failed private tests [' + market['type'] + ']: ' + errors.join (', '));
        } else {
            if (this.info) {
                dump (this.addPadding ('[INFO:PRIVATE_TESTS_DONE]', 25), exchange.id);
            }
        }
    }

    async startTest (exchange, symbol) {
        // we do not need to test aliases
        if (exchange.alias) {
            return;
        }
        if (this.sandbox || getExchangeProp (exchange, 'sandbox')) {
            exchange.setSandboxMode (true);
        }
        // because of python-async, we need proper `.close()` handling
        try {
            const result = await this.loadExchange (exchange);
            if (!result) {
                await close (exchange);
                return;
            }
            await this.testExchange (exchange, symbol);
            await close (exchange);
        } catch (e) {
            await close (exchange);
            throw e;
        }
    }
}
// ***** AUTO-TRANSPILER-END *****
// *******************************
(new testMainClass ()).init (exchangeIdFromArgv, exchangeSymbol);
