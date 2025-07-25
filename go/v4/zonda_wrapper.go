package ccxt

type Zonda struct {
   *zonda
   Core *zonda
   exchangeTyped *ExchangeTyped
}

func NewZonda(userConfig map[string]interface{}) *Zonda {
   p := &zonda{}
   p.Init(userConfig)
   return &Zonda{
       zonda: p,
       Core:  p,
       exchangeTyped: NewExchangeTyped(&p.Exchange),
   }
}

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code


/**
 * @method
 * @name zonda#fetchMarkets
 * @see https://docs.zondacrypto.exchange/reference/ticker-1
 * @description retrieves data on all markets for zonda
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @returns {object[]} an array of objects representing market data
 */
func (this *Zonda) FetchMarkets(params ...interface{}) ([]MarketInterface, error) {
    res := <- this.Core.FetchMarkets(params...)
    if IsError(res) {
        return nil, CreateReturnError(res)
    }
    return NewMarketInterfaceArray(res), nil
}
/**
 * @method
 * @name zonda#fetchOpenOrders
 * @see https://docs.zondacrypto.exchange/reference/active-orders
 * @description fetch all unfilled currently open orders
 * @param {string} symbol not used by zonda fetchOpenOrders
 * @param {int} [since] the earliest time in ms to fetch open orders for
 * @param {int} [limit] the maximum number of  open orders structures to retrieve
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
 */
func (this *Zonda) FetchOpenOrders(options ...FetchOpenOrdersOptions) ([]Order, error) {

    opts := FetchOpenOrdersOptionsStruct{}

    for _, opt := range options {
        opt(&opts)
    }

    var symbol interface{} = nil
    if opts.Symbol != nil {
        symbol = *opts.Symbol
    }

    var since interface{} = nil
    if opts.Since != nil {
        since = *opts.Since
    }

    var limit interface{} = nil
    if opts.Limit != nil {
        limit = *opts.Limit
    }

    var params interface{} = nil
    if opts.Params != nil {
        params = *opts.Params
    }
    res := <- this.Core.FetchOpenOrders(symbol, since, limit, params)
    if IsError(res) {
        return nil, CreateReturnError(res)
    }
    return NewOrderArray(res), nil
}
/**
 * @method
 * @name zonda#fetchMyTrades
 * @see https://docs.zondacrypto.exchange/reference/transactions-history
 * @description fetch all trades made by the user
 * @param {string} symbol unified market symbol
 * @param {int} [since] the earliest time in ms to fetch trades for
 * @param {int} [limit] the maximum number of trades structures to retrieve
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=trade-structure}
 */
func (this *Zonda) FetchMyTrades(options ...FetchMyTradesOptions) ([]Trade, error) {

    opts := FetchMyTradesOptionsStruct{}

    for _, opt := range options {
        opt(&opts)
    }

    var symbol interface{} = nil
    if opts.Symbol != nil {
        symbol = *opts.Symbol
    }

    var since interface{} = nil
    if opts.Since != nil {
        since = *opts.Since
    }

    var limit interface{} = nil
    if opts.Limit != nil {
        limit = *opts.Limit
    }

    var params interface{} = nil
    if opts.Params != nil {
        params = *opts.Params
    }
    res := <- this.Core.FetchMyTrades(symbol, since, limit, params)
    if IsError(res) {
        return nil, CreateReturnError(res)
    }
    return NewTradeArray(res), nil
}
/**
 * @method
 * @name zonda#fetchBalance
 * @see https://docs.zondacrypto.exchange/reference/list-of-wallets
 * @description query for balance and get the amount of funds available for trading or funds locked in orders
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @returns {object} a [balance structure]{@link https://docs.ccxt.com/#/?id=balance-structure}
 */
func (this *Zonda) FetchBalance(params ...interface{}) (Balances, error) {
    res := <- this.Core.FetchBalance(params...)
    if IsError(res) {
        return Balances{}, CreateReturnError(res)
    }
    return NewBalances(res), nil
}
/**
 * @method
 * @name zonda#fetchOrderBook
 * @see https://docs.zondacrypto.exchange/reference/orderbook-2
 * @description fetches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
 * @param {string} symbol unified symbol of the market to fetch the order book for
 * @param {int} [limit] the maximum amount of order book entries to return
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @returns {object} A dictionary of [order book structures]{@link https://docs.ccxt.com/#/?id=order-book-structure} indexed by market symbols
 */
func (this *Zonda) FetchOrderBook(symbol string, options ...FetchOrderBookOptions) (OrderBook, error) {

    opts := FetchOrderBookOptionsStruct{}

    for _, opt := range options {
        opt(&opts)
    }

    var limit interface{} = nil
    if opts.Limit != nil {
        limit = *opts.Limit
    }

    var params interface{} = nil
    if opts.Params != nil {
        params = *opts.Params
    }
    res := <- this.Core.FetchOrderBook(symbol, limit, params)
    if IsError(res) {
        return OrderBook{}, CreateReturnError(res)
    }
    return NewOrderBook(res), nil
}
/**
 * @method
 * @name zonda#fetchTicker
 * @description v1_01PublicGetTradingTickerSymbol retrieves timestamp, datetime, bid, ask, close, last, previousClose, v1_01PublicGetTradingStatsSymbol retrieves high, low, volume and opening price of an asset
 * @see https://docs.zondacrypto.exchange/reference/market-statistics
 * @param {string} symbol unified symbol of the market to fetch the ticker for
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @param {string} [params.method] v1_01PublicGetTradingTickerSymbol (default) or v1_01PublicGetTradingStatsSymbol
 * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
 */
func (this *Zonda) FetchTicker(symbol string, options ...FetchTickerOptions) (Ticker, error) {

    opts := FetchTickerOptionsStruct{}

    for _, opt := range options {
        opt(&opts)
    }

    var params interface{} = nil
    if opts.Params != nil {
        params = *opts.Params
    }
    res := <- this.Core.FetchTicker(symbol, params)
    if IsError(res) {
        return Ticker{}, CreateReturnError(res)
    }
    return NewTicker(res), nil
}
func (this *Zonda) FetchTickers(options ...FetchTickersOptions) (Tickers, error) {

    opts := FetchTickersOptionsStruct{}

    for _, opt := range options {
        opt(&opts)
    }

    var symbols interface{} = nil
    if opts.Symbols != nil {
        symbols = *opts.Symbols
    }

    var params interface{} = nil
    if opts.Params != nil {
        params = *opts.Params
    }
    res := <- this.Core.FetchTickers(symbols, params)
    if IsError(res) {
        return Tickers{}, CreateReturnError(res)
    }
    return NewTickers(res), nil
}
/**
 * @method
 * @name zonda#fetchLedger
 * @description fetch the history of changes, actions done by the user or operations that altered the balance of the user
 * @see https://docs.zondacrypto.exchange/reference/operations-history
 * @param {string} [code] unified currency code, default is undefined
 * @param {int} [since] timestamp in ms of the earliest ledger entry, default is undefined
 * @param {int} [limit] max number of ledger entries to return, default is undefined
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @returns {object} a [ledger structure]{@link https://docs.ccxt.com/#/?id=ledger}
 */
func (this *Zonda) FetchLedger(options ...FetchLedgerOptions) ([]LedgerEntry, error) {

    opts := FetchLedgerOptionsStruct{}

    for _, opt := range options {
        opt(&opts)
    }

    var code interface{} = nil
    if opts.Code != nil {
        code = *opts.Code
    }

    var since interface{} = nil
    if opts.Since != nil {
        since = *opts.Since
    }

    var limit interface{} = nil
    if opts.Limit != nil {
        limit = *opts.Limit
    }

    var params interface{} = nil
    if opts.Params != nil {
        params = *opts.Params
    }
    res := <- this.Core.FetchLedger(code, since, limit, params)
    if IsError(res) {
        return nil, CreateReturnError(res)
    }
    return NewLedgerEntryArray(res), nil
}
/**
 * @method
 * @name zonda#fetchOHLCV
 * @see https://docs.zondacrypto.exchange/reference/candles-chart
 * @description fetches historical candlestick data containing the open, high, low, and close price, and the volume of a market
 * @param {string} symbol unified symbol of the market to fetch OHLCV data for
 * @param {string} timeframe the length of time each candle represents
 * @param {int} [since] timestamp in ms of the earliest candle to fetch
 * @param {int} [limit] the maximum amount of candles to fetch
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @returns {int[][]} A list of candles ordered as timestamp, open, high, low, close, volume
 */
func (this *Zonda) FetchOHLCV(symbol string, options ...FetchOHLCVOptions) ([]OHLCV, error) {

    opts := FetchOHLCVOptionsStruct{}

    for _, opt := range options {
        opt(&opts)
    }

    var timeframe interface{} = nil
    if opts.Timeframe != nil {
        timeframe = *opts.Timeframe
    }

    var since interface{} = nil
    if opts.Since != nil {
        since = *opts.Since
    }

    var limit interface{} = nil
    if opts.Limit != nil {
        limit = *opts.Limit
    }

    var params interface{} = nil
    if opts.Params != nil {
        params = *opts.Params
    }
    res := <- this.Core.FetchOHLCV(symbol, timeframe, since, limit, params)
    if IsError(res) {
        return nil, CreateReturnError(res)
    }
    return NewOHLCVArray(res), nil
}
/**
 * @method
 * @name zonda#fetchTrades
 * @see https://docs.zondacrypto.exchange/reference/last-transactions
 * @description get the list of most recent trades for a particular symbol
 * @param {string} symbol unified symbol of the market to fetch trades for
 * @param {int} [since] timestamp in ms of the earliest trade to fetch
 * @param {int} [limit] the maximum amount of trades to fetch
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=public-trades}
 */
func (this *Zonda) FetchTrades(symbol string, options ...FetchTradesOptions) ([]Trade, error) {

    opts := FetchTradesOptionsStruct{}

    for _, opt := range options {
        opt(&opts)
    }

    var since interface{} = nil
    if opts.Since != nil {
        since = *opts.Since
    }

    var limit interface{} = nil
    if opts.Limit != nil {
        limit = *opts.Limit
    }

    var params interface{} = nil
    if opts.Params != nil {
        params = *opts.Params
    }
    res := <- this.Core.FetchTrades(symbol, since, limit, params)
    if IsError(res) {
        return nil, CreateReturnError(res)
    }
    return NewTradeArray(res), nil
}
/**
 * @method
 * @name zonda#createOrder
 * @description create a trade order
 * @see https://docs.zondacrypto.exchange/reference/new-order
 * @param {string} symbol unified symbol of the market to create an order in
 * @param {string} type 'market' or 'limit'
 * @param {string} side 'buy' or 'sell'
 * @param {float} amount how much of currency you want to trade in units of base currency
 * @param {float} [price] the price at which the order is to be fulfilled, in units of the quote currency, ignored in market orders
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
 */
func (this *Zonda) CreateOrder(symbol string, typeVar string, side string, amount float64, options ...CreateOrderOptions) (Order, error) {

    opts := CreateOrderOptionsStruct{}

    for _, opt := range options {
        opt(&opts)
    }

    var price interface{} = nil
    if opts.Price != nil {
        price = *opts.Price
    }

    var params interface{} = nil
    if opts.Params != nil {
        params = *opts.Params
    }
    res := <- this.Core.CreateOrder(symbol, typeVar, side, amount, price, params)
    if IsError(res) {
        return Order{}, CreateReturnError(res)
    }
    return NewOrder(res), nil
}
/**
 * @method
 * @name zonda#cancelOrder
 * @see https://docs.zondacrypto.exchange/reference/cancel-order
 * @description cancels an open order
 * @param {string} id order id
 * @param {string} symbol unified symbol of the market the order was made in
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
 */
func (this *Zonda) CancelOrder(id string, options ...CancelOrderOptions) (Order, error) {

    opts := CancelOrderOptionsStruct{}

    for _, opt := range options {
        opt(&opts)
    }

    var symbol interface{} = nil
    if opts.Symbol != nil {
        symbol = *opts.Symbol
    }

    var params interface{} = nil
    if opts.Params != nil {
        params = *opts.Params
    }
    res := <- this.Core.CancelOrder(id, symbol, params)
    if IsError(res) {
        return Order{}, CreateReturnError(res)
    }
    return NewOrder(res), nil
}
/**
 * @method
 * @name zonda#fetchDepositAddress
 * @see https://docs.zondacrypto.exchange/reference/deposit-addresses-for-crypto
 * @description fetch the deposit address for a currency associated with this account
 * @param {string} code unified currency code
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @param {string} [params.walletId] Wallet id to filter deposit adresses.
 * @returns {object} an [address structure]{@link https://docs.ccxt.com/#/?id=address-structure}
 */
func (this *Zonda) FetchDepositAddress(code string, options ...FetchDepositAddressOptions) (DepositAddress, error) {

    opts := FetchDepositAddressOptionsStruct{}

    for _, opt := range options {
        opt(&opts)
    }

    var params interface{} = nil
    if opts.Params != nil {
        params = *opts.Params
    }
    res := <- this.Core.FetchDepositAddress(code, params)
    if IsError(res) {
        return DepositAddress{}, CreateReturnError(res)
    }
    return NewDepositAddress(res), nil
}
/**
 * @method
 * @name zonda#fetchDepositAddresses
 * @see https://docs.zondacrypto.exchange/reference/deposit-addresses-for-crypto
 * @description fetch deposit addresses for multiple currencies and chain types
 * @param {string[]|undefined} codes zonda does not support filtering filtering by multiple codes and will ignore this parameter.
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @returns {object} a list of [address structures]{@link https://docs.ccxt.com/#/?id=address-structure}
 */
func (this *Zonda) FetchDepositAddresses(options ...FetchDepositAddressesOptions) ([]DepositAddress, error) {

    opts := FetchDepositAddressesOptionsStruct{}

    for _, opt := range options {
        opt(&opts)
    }

    var codes interface{} = nil
    if opts.Codes != nil {
        codes = *opts.Codes
    }

    var params interface{} = nil
    if opts.Params != nil {
        params = *opts.Params
    }
    res := <- this.Core.FetchDepositAddresses(codes, params)
    if IsError(res) {
        return nil, CreateReturnError(res)
    }
    return NewDepositAddressArray(res), nil
}
/**
 * @method
 * @name zonda#transfer
 * @see https://docs.zondacrypto.exchange/reference/internal-transfer
 * @description transfer currency internally between wallets on the same account
 * @param {string} code unified currency code
 * @param {float} amount amount to transfer
 * @param {string} fromAccount account to transfer from
 * @param {string} toAccount account to transfer to
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @returns {object} a [transfer structure]{@link https://docs.ccxt.com/#/?id=transfer-structure}
 */
func (this *Zonda) Transfer(code string, amount float64, fromAccount string, toAccount string, options ...TransferOptions) (TransferEntry, error) {

    opts := TransferOptionsStruct{}

    for _, opt := range options {
        opt(&opts)
    }

    var params interface{} = nil
    if opts.Params != nil {
        params = *opts.Params
    }
    res := <- this.Core.Transfer(code, amount, fromAccount, toAccount, params)
    if IsError(res) {
        return TransferEntry{}, CreateReturnError(res)
    }
    return NewTransferEntry(res), nil
}
/**
 * @method
 * @name zonda#withdraw
 * @see https://docs.zondacrypto.exchange/reference/crypto-withdrawal-1
 * @description make a withdrawal
 * @param {string} code unified currency code
 * @param {float} amount the amount to withdraw
 * @param {string} address the address to withdraw to
 * @param {string} tag
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @returns {object} a [transaction structure]{@link https://docs.ccxt.com/#/?id=transaction-structure}
 */
func (this *Zonda) Withdraw(code string, amount float64, address string, options ...WithdrawOptions) (Transaction, error) {

    opts := WithdrawOptionsStruct{}

    for _, opt := range options {
        opt(&opts)
    }

    var tag interface{} = nil
    if opts.Tag != nil {
        tag = *opts.Tag
    }

    var params interface{} = nil
    if opts.Params != nil {
        params = *opts.Params
    }
    res := <- this.Core.Withdraw(code, amount, address, tag, params)
    if IsError(res) {
        return Transaction{}, CreateReturnError(res)
    }
    return NewTransaction(res), nil
}
// missing typed methods from base
//nolint
func (this *Zonda) CancelAllOrders(options ...CancelAllOrdersOptions) ([]Order, error) {return this.exchangeTyped.CancelAllOrders(options...)}
func (this *Zonda) CancelAllOrdersAfter(timeout int64, options ...CancelAllOrdersAfterOptions) (map[string]interface{}, error) {return this.exchangeTyped.CancelAllOrdersAfter(timeout, options...)}
func (this *Zonda) CancelOrdersForSymbols(orders []CancellationRequest, options ...CancelOrdersForSymbolsOptions) ([]Order, error) {return this.exchangeTyped.CancelOrdersForSymbols(orders, options...)}
func (this *Zonda) CreateConvertTrade(id string, fromCode string, toCode string, options ...CreateConvertTradeOptions) (Conversion, error) {return this.exchangeTyped.CreateConvertTrade(id, fromCode, toCode, options...)}
func (this *Zonda) CreateDepositAddress(code string, options ...CreateDepositAddressOptions) (DepositAddress, error) {return this.exchangeTyped.CreateDepositAddress(code, options...)}
func (this *Zonda) CreateLimitBuyOrder(symbol string, amount float64, price float64, options ...CreateLimitBuyOrderOptions) (Order, error) {return this.exchangeTyped.CreateLimitBuyOrder(symbol, amount, price, options...)}
func (this *Zonda) CreateLimitOrder(symbol string, side string, amount float64, price float64, options ...CreateLimitOrderOptions) (Order, error) {return this.exchangeTyped.CreateLimitOrder(symbol, side, amount, price, options...)}
func (this *Zonda) CreateLimitSellOrder(symbol string, amount float64, price float64, options ...CreateLimitSellOrderOptions) (Order, error) {return this.exchangeTyped.CreateLimitSellOrder(symbol, amount, price, options...)}
func (this *Zonda) CreateMarketBuyOrder(symbol string, amount float64, options ...CreateMarketBuyOrderOptions) (Order, error) {return this.exchangeTyped.CreateMarketBuyOrder(symbol, amount, options...)}
func (this *Zonda) CreateMarketBuyOrderWithCost(symbol string, cost float64, options ...CreateMarketBuyOrderWithCostOptions) (Order, error) {return this.exchangeTyped.CreateMarketBuyOrderWithCost(symbol, cost, options...)}
func (this *Zonda) CreateMarketOrder(symbol string, side string, amount float64, options ...CreateMarketOrderOptions) (Order, error) {return this.exchangeTyped.CreateMarketOrder(symbol, side, amount, options...)}
func (this *Zonda) CreateMarketOrderWithCost(symbol string, side string, cost float64, options ...CreateMarketOrderWithCostOptions) (Order, error) {return this.exchangeTyped.CreateMarketOrderWithCost(symbol, side, cost, options...)}
func (this *Zonda) CreateMarketSellOrder(symbol string, amount float64, options ...CreateMarketSellOrderOptions) (Order, error) {return this.exchangeTyped.CreateMarketSellOrder(symbol, amount, options...)}
func (this *Zonda) CreateMarketSellOrderWithCost(symbol string, cost float64, options ...CreateMarketSellOrderWithCostOptions) (Order, error) {return this.exchangeTyped.CreateMarketSellOrderWithCost(symbol, cost, options...)}
func (this *Zonda) CreateOrders(orders []OrderRequest, options ...CreateOrdersOptions) ([]Order, error) {return this.exchangeTyped.CreateOrders(orders, options...)}
func (this *Zonda) CreateOrderWithTakeProfitAndStopLoss(symbol string, typeVar string, side string, amount float64, options ...CreateOrderWithTakeProfitAndStopLossOptions) (Order, error) {return this.exchangeTyped.CreateOrderWithTakeProfitAndStopLoss(symbol, typeVar, side, amount, options...)}
func (this *Zonda) CreatePostOnlyOrder(symbol string, typeVar string, side string, amount float64, options ...CreatePostOnlyOrderOptions) (Order, error) {return this.exchangeTyped.CreatePostOnlyOrder(symbol, typeVar, side, amount, options...)}
func (this *Zonda) CreateReduceOnlyOrder(symbol string, typeVar string, side string, amount float64, options ...CreateReduceOnlyOrderOptions) (Order, error) {return this.exchangeTyped.CreateReduceOnlyOrder(symbol, typeVar, side, amount, options...)}
func (this *Zonda) CreateStopLimitOrder(symbol string, side string, amount float64, price float64, triggerPrice float64, options ...CreateStopLimitOrderOptions) (Order, error) {return this.exchangeTyped.CreateStopLimitOrder(symbol, side, amount, price, triggerPrice, options...)}
func (this *Zonda) CreateStopLossOrder(symbol string, typeVar string, side string, amount float64, options ...CreateStopLossOrderOptions) (Order, error) {return this.exchangeTyped.CreateStopLossOrder(symbol, typeVar, side, amount, options...)}
func (this *Zonda) CreateStopMarketOrder(symbol string, side string, amount float64, triggerPrice float64, options ...CreateStopMarketOrderOptions) (Order, error) {return this.exchangeTyped.CreateStopMarketOrder(symbol, side, amount, triggerPrice, options...)}
func (this *Zonda) CreateStopOrder(symbol string, typeVar string, side string, amount float64, options ...CreateStopOrderOptions) (Order, error) {return this.exchangeTyped.CreateStopOrder(symbol, typeVar, side, amount, options...)}
func (this *Zonda) CreateTakeProfitOrder(symbol string, typeVar string, side string, amount float64, options ...CreateTakeProfitOrderOptions) (Order, error) {return this.exchangeTyped.CreateTakeProfitOrder(symbol, typeVar, side, amount, options...)}
func (this *Zonda) CreateTrailingAmountOrder(symbol string, typeVar string, side string, amount float64, options ...CreateTrailingAmountOrderOptions) (Order, error) {return this.exchangeTyped.CreateTrailingAmountOrder(symbol, typeVar, side, amount, options...)}
func (this *Zonda) CreateTrailingPercentOrder(symbol string, typeVar string, side string, amount float64, options ...CreateTrailingPercentOrderOptions) (Order, error) {return this.exchangeTyped.CreateTrailingPercentOrder(symbol, typeVar, side, amount, options...)}
func (this *Zonda) CreateTriggerOrder(symbol string, typeVar string, side string, amount float64, options ...CreateTriggerOrderOptions) (Order, error) {return this.exchangeTyped.CreateTriggerOrder(symbol, typeVar, side, amount, options...)}
func (this *Zonda) EditLimitBuyOrder(id string, symbol string, amount float64, options ...EditLimitBuyOrderOptions) (Order, error) {return this.exchangeTyped.EditLimitBuyOrder(id, symbol, amount, options...)}
func (this *Zonda) EditLimitOrder(id string, symbol string, side string, amount float64, options ...EditLimitOrderOptions) (Order, error) {return this.exchangeTyped.EditLimitOrder(id, symbol, side, amount, options...)}
func (this *Zonda) EditLimitSellOrder(id string, symbol string, amount float64, options ...EditLimitSellOrderOptions) (Order, error) {return this.exchangeTyped.EditLimitSellOrder(id, symbol, amount, options...)}
func (this *Zonda) EditOrder(id string, symbol string, typeVar string, side string, options ...EditOrderOptions) (Order, error) {return this.exchangeTyped.EditOrder(id, symbol, typeVar, side, options...)}
func (this *Zonda) EditOrders(orders []OrderRequest, options ...EditOrdersOptions) ([]Order, error) {return this.exchangeTyped.EditOrders(orders, options...)}
func (this *Zonda) FetchAccounts(params ...interface{}) ([]Account, error) {return this.exchangeTyped.FetchAccounts(params...)}
func (this *Zonda) FetchAllGreeks(options ...FetchAllGreeksOptions) ([]Greeks, error) {return this.exchangeTyped.FetchAllGreeks(options...)}
func (this *Zonda) FetchBidsAsks(options ...FetchBidsAsksOptions) (Tickers, error) {return this.exchangeTyped.FetchBidsAsks(options...)}
func (this *Zonda) FetchBorrowInterest(options ...FetchBorrowInterestOptions) ([]BorrowInterest, error) {return this.exchangeTyped.FetchBorrowInterest(options...)}
func (this *Zonda) FetchBorrowRate(code string, amount float64, options ...FetchBorrowRateOptions) (map[string]interface{}, error) {return this.exchangeTyped.FetchBorrowRate(code, amount, options...)}
func (this *Zonda) FetchCanceledAndClosedOrders(options ...FetchCanceledAndClosedOrdersOptions) ([]Order, error) {return this.exchangeTyped.FetchCanceledAndClosedOrders(options...)}
func (this *Zonda) FetchClosedOrders(options ...FetchClosedOrdersOptions) ([]Order, error) {return this.exchangeTyped.FetchClosedOrders(options...)}
func (this *Zonda) FetchConvertCurrencies(params ...interface{}) (Currencies, error) {return this.exchangeTyped.FetchConvertCurrencies(params...)}
func (this *Zonda) FetchConvertQuote(fromCode string, toCode string, options ...FetchConvertQuoteOptions) (Conversion, error) {return this.exchangeTyped.FetchConvertQuote(fromCode, toCode, options...)}
func (this *Zonda) FetchConvertTrade(id string, options ...FetchConvertTradeOptions) (Conversion, error) {return this.exchangeTyped.FetchConvertTrade(id, options...)}
func (this *Zonda) FetchConvertTradeHistory(options ...FetchConvertTradeHistoryOptions) ([]Conversion, error) {return this.exchangeTyped.FetchConvertTradeHistory(options...)}
func (this *Zonda) FetchCrossBorrowRate(code string, options ...FetchCrossBorrowRateOptions) (CrossBorrowRate, error) {return this.exchangeTyped.FetchCrossBorrowRate(code, options...)}
func (this *Zonda) FetchCrossBorrowRates(params ...interface{}) (CrossBorrowRates, error) {return this.exchangeTyped.FetchCrossBorrowRates(params...)}
func (this *Zonda) FetchCurrencies(params ...interface{}) (Currencies, error) {return this.exchangeTyped.FetchCurrencies(params...)}
func (this *Zonda) FetchDepositAddressesByNetwork(code string, options ...FetchDepositAddressesByNetworkOptions) ([]DepositAddress, error) {return this.exchangeTyped.FetchDepositAddressesByNetwork(code, options...)}
func (this *Zonda) FetchDeposits(options ...FetchDepositsOptions) ([]Transaction, error) {return this.exchangeTyped.FetchDeposits(options...)}
func (this *Zonda) FetchDepositsWithdrawals(options ...FetchDepositsWithdrawalsOptions) ([]Transaction, error) {return this.exchangeTyped.FetchDepositsWithdrawals(options...)}
func (this *Zonda) FetchDepositWithdrawFee(code string, options ...FetchDepositWithdrawFeeOptions) (map[string]interface{}, error) {return this.exchangeTyped.FetchDepositWithdrawFee(code, options...)}
func (this *Zonda) FetchDepositWithdrawFees(options ...FetchDepositWithdrawFeesOptions) (map[string]interface{}, error) {return this.exchangeTyped.FetchDepositWithdrawFees(options...)}
func (this *Zonda) FetchFreeBalance(params ...interface{}) (Balance, error) {return this.exchangeTyped.FetchFreeBalance(params...)}
func (this *Zonda) FetchFundingHistory(options ...FetchFundingHistoryOptions) ([]FundingHistory, error) {return this.exchangeTyped.FetchFundingHistory(options...)}
func (this *Zonda) FetchFundingInterval(symbol string, options ...FetchFundingIntervalOptions) (FundingRate, error) {return this.exchangeTyped.FetchFundingInterval(symbol, options...)}
func (this *Zonda) FetchFundingIntervals(options ...FetchFundingIntervalsOptions) (FundingRates, error) {return this.exchangeTyped.FetchFundingIntervals(options...)}
func (this *Zonda) FetchFundingRate(symbol string, options ...FetchFundingRateOptions) (FundingRate, error) {return this.exchangeTyped.FetchFundingRate(symbol, options...)}
func (this *Zonda) FetchFundingRateHistory(options ...FetchFundingRateHistoryOptions) ([]FundingRateHistory, error) {return this.exchangeTyped.FetchFundingRateHistory(options...)}
func (this *Zonda) FetchFundingRates(options ...FetchFundingRatesOptions) (FundingRates, error) {return this.exchangeTyped.FetchFundingRates(options...)}
func (this *Zonda) FetchGreeks(symbol string, options ...FetchGreeksOptions) (Greeks, error) {return this.exchangeTyped.FetchGreeks(symbol, options...)}
func (this *Zonda) FetchIndexOHLCV(symbol string, options ...FetchIndexOHLCVOptions) ([]OHLCV, error) {return this.exchangeTyped.FetchIndexOHLCV(symbol, options...)}
func (this *Zonda) FetchIsolatedBorrowRate(symbol string, options ...FetchIsolatedBorrowRateOptions) (IsolatedBorrowRate, error) {return this.exchangeTyped.FetchIsolatedBorrowRate(symbol, options...)}
func (this *Zonda) FetchIsolatedBorrowRates(params ...interface{}) (IsolatedBorrowRates, error) {return this.exchangeTyped.FetchIsolatedBorrowRates(params...)}
func (this *Zonda) FetchLastPrices(options ...FetchLastPricesOptions) (LastPrices, error) {return this.exchangeTyped.FetchLastPrices(options...)}
func (this *Zonda) FetchLedgerEntry(id string, options ...FetchLedgerEntryOptions) (LedgerEntry, error) {return this.exchangeTyped.FetchLedgerEntry(id, options...)}
func (this *Zonda) FetchLeverage(symbol string, options ...FetchLeverageOptions) (Leverage, error) {return this.exchangeTyped.FetchLeverage(symbol, options...)}
func (this *Zonda) FetchLeverages(options ...FetchLeveragesOptions) (Leverages, error) {return this.exchangeTyped.FetchLeverages(options...)}
func (this *Zonda) FetchLeverageTiers(options ...FetchLeverageTiersOptions) (LeverageTiers, error) {return this.exchangeTyped.FetchLeverageTiers(options...)}
func (this *Zonda) FetchLiquidations(symbol string, options ...FetchLiquidationsOptions) ([]Liquidation, error) {return this.exchangeTyped.FetchLiquidations(symbol, options...)}
func (this *Zonda) FetchLongShortRatio(symbol string, options ...FetchLongShortRatioOptions) (LongShortRatio, error) {return this.exchangeTyped.FetchLongShortRatio(symbol, options...)}
func (this *Zonda) FetchLongShortRatioHistory(options ...FetchLongShortRatioHistoryOptions) ([]LongShortRatio, error) {return this.exchangeTyped.FetchLongShortRatioHistory(options...)}
func (this *Zonda) FetchMarginAdjustmentHistory(options ...FetchMarginAdjustmentHistoryOptions) ([]MarginModification, error) {return this.exchangeTyped.FetchMarginAdjustmentHistory(options...)}
func (this *Zonda) FetchMarginMode(symbol string, options ...FetchMarginModeOptions) (MarginMode, error) {return this.exchangeTyped.FetchMarginMode(symbol, options...)}
func (this *Zonda) FetchMarginModes(options ...FetchMarginModesOptions) (MarginModes, error) {return this.exchangeTyped.FetchMarginModes(options...)}
func (this *Zonda) FetchMarketLeverageTiers(symbol string, options ...FetchMarketLeverageTiersOptions) ([]LeverageTier, error) {return this.exchangeTyped.FetchMarketLeverageTiers(symbol, options...)}
func (this *Zonda) FetchMarkOHLCV(symbol interface{}, options ...FetchMarkOHLCVOptions) ([]OHLCV, error) {return this.exchangeTyped.FetchMarkOHLCV(symbol, options...)}
func (this *Zonda) FetchMarkPrice(symbol string, options ...FetchMarkPriceOptions) (Ticker, error) {return this.exchangeTyped.FetchMarkPrice(symbol, options...)}
func (this *Zonda) FetchMarkPrices(options ...FetchMarkPricesOptions) (Tickers, error) {return this.exchangeTyped.FetchMarkPrices(options...)}
func (this *Zonda) FetchMyLiquidations(options ...FetchMyLiquidationsOptions) ([]Liquidation, error) {return this.exchangeTyped.FetchMyLiquidations(options...)}
func (this *Zonda) FetchOpenInterest(symbol string, options ...FetchOpenInterestOptions) (OpenInterest, error) {return this.exchangeTyped.FetchOpenInterest(symbol, options...)}
func (this *Zonda) FetchOpenInterestHistory(symbol string, options ...FetchOpenInterestHistoryOptions) ([]OpenInterest, error) {return this.exchangeTyped.FetchOpenInterestHistory(symbol, options...)}
func (this *Zonda) FetchOpenInterests(options ...FetchOpenInterestsOptions) (OpenInterests, error) {return this.exchangeTyped.FetchOpenInterests(options...)}
func (this *Zonda) FetchOption(symbol string, options ...FetchOptionOptions) (Option, error) {return this.exchangeTyped.FetchOption(symbol, options...)}
func (this *Zonda) FetchOptionChain(code string, options ...FetchOptionChainOptions) (OptionChain, error) {return this.exchangeTyped.FetchOptionChain(code, options...)}
func (this *Zonda) FetchOrder(id string, options ...FetchOrderOptions) (Order, error) {return this.exchangeTyped.FetchOrder(id, options...)}
func (this *Zonda) FetchOrderBooks(options ...FetchOrderBooksOptions) (OrderBooks, error) {return this.exchangeTyped.FetchOrderBooks(options...)}
func (this *Zonda) FetchOrders(options ...FetchOrdersOptions) ([]Order, error) {return this.exchangeTyped.FetchOrders(options...)}
func (this *Zonda) FetchOrderStatus(id string, options ...FetchOrderStatusOptions) (string, error) {return this.exchangeTyped.FetchOrderStatus(id, options...)}
func (this *Zonda) FetchOrderTrades(id string, options ...FetchOrderTradesOptions) ([]Trade, error) {return this.exchangeTyped.FetchOrderTrades(id, options...)}
func (this *Zonda) FetchPaymentMethods(params ...interface{}) (map[string]interface{}, error) {return this.exchangeTyped.FetchPaymentMethods(params...)}
func (this *Zonda) FetchPosition(symbol string, options ...FetchPositionOptions) (Position, error) {return this.exchangeTyped.FetchPosition(symbol, options...)}
func (this *Zonda) FetchPositionHistory(symbol string, options ...FetchPositionHistoryOptions) ([]Position, error) {return this.exchangeTyped.FetchPositionHistory(symbol, options...)}
func (this *Zonda) FetchPositionMode(options ...FetchPositionModeOptions) (map[string]interface{}, error) {return this.exchangeTyped.FetchPositionMode(options...)}
func (this *Zonda) FetchPositions(options ...FetchPositionsOptions) ([]Position, error) {return this.exchangeTyped.FetchPositions(options...)}
func (this *Zonda) FetchPositionsForSymbol(symbol string, options ...FetchPositionsForSymbolOptions) ([]Position, error) {return this.exchangeTyped.FetchPositionsForSymbol(symbol, options...)}
func (this *Zonda) FetchPositionsHistory(options ...FetchPositionsHistoryOptions) ([]Position, error) {return this.exchangeTyped.FetchPositionsHistory(options...)}
func (this *Zonda) FetchPositionsRisk(options ...FetchPositionsRiskOptions) ([]Position, error) {return this.exchangeTyped.FetchPositionsRisk(options...)}
func (this *Zonda) FetchPremiumIndexOHLCV(symbol string, options ...FetchPremiumIndexOHLCVOptions) ([]OHLCV, error) {return this.exchangeTyped.FetchPremiumIndexOHLCV(symbol, options...)}
func (this *Zonda) FetchStatus(params ...interface{}) (map[string]interface{}, error) {return this.exchangeTyped.FetchStatus(params...)}
func (this *Zonda) FetchTime(params ...interface{}) ( int64, error) {return this.exchangeTyped.FetchTime(params...)}
func (this *Zonda) FetchTradingFee(symbol string, options ...FetchTradingFeeOptions) (TradingFeeInterface, error) {return this.exchangeTyped.FetchTradingFee(symbol, options...)}
func (this *Zonda) FetchTradingFees(params ...interface{}) (TradingFees, error) {return this.exchangeTyped.FetchTradingFees(params...)}
func (this *Zonda) FetchTradingLimits(options ...FetchTradingLimitsOptions) (map[string]interface{}, error) {return this.exchangeTyped.FetchTradingLimits(options...)}
func (this *Zonda) FetchTransactionFee(code string, options ...FetchTransactionFeeOptions) (map[string]interface{}, error) {return this.exchangeTyped.FetchTransactionFee(code, options...)}
func (this *Zonda) FetchTransactionFees(options ...FetchTransactionFeesOptions) (map[string]interface{}, error) {return this.exchangeTyped.FetchTransactionFees(options...)}
func (this *Zonda) FetchTransactions(options ...FetchTransactionsOptions) ([]Transaction, error) {return this.exchangeTyped.FetchTransactions(options...)}
func (this *Zonda) FetchTransfer(id string, options ...FetchTransferOptions) (TransferEntry, error) {return this.exchangeTyped.FetchTransfer(id, options...)}
func (this *Zonda) FetchTransfers(options ...FetchTransfersOptions) ([]TransferEntry, error) {return this.exchangeTyped.FetchTransfers(options...)}
func (this *Zonda) FetchWithdrawals(options ...FetchWithdrawalsOptions) ([]Transaction, error) {return this.exchangeTyped.FetchWithdrawals(options...)}
func (this *Zonda) SetMargin(symbol string, amount float64, options ...SetMarginOptions) (MarginModification, error) {return this.exchangeTyped.SetMargin(symbol, amount, options...)}
func (this *Zonda) SetMarginMode(marginMode string, options ...SetMarginModeOptions) (map[string]interface{}, error) {return this.exchangeTyped.SetMarginMode(marginMode, options...)}
func (this *Zonda) SetPositionMode(hedged bool, options ...SetPositionModeOptions) (map[string]interface{}, error) {return this.exchangeTyped.SetPositionMode(hedged, options...)}