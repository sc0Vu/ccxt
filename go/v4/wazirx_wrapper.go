package ccxt

type Wazirx struct {
   *wazirx
   Core *wazirx
}

func NewWazirx(userConfig map[string]interface{}) Wazirx {
   p := &wazirx{}
   p.Init(userConfig)
   return Wazirx{
       wazirx: p,
       Core:  p,
   }
}

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code


/**
 * @method
 * @name wazirx#fetchMarkets
 * @see https://docs.wazirx.com/#exchange-info
 * @description retrieves data on all markets for wazirx
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @returns {object[]} an array of objects representing market data
 */
func (this *Wazirx) FetchMarkets(params ...interface{}) ([]MarketInterface, error) {
    res := <- this.Core.FetchMarkets(params...)
    if IsError(res) {
        return nil, CreateReturnError(res)
    }
    return NewMarketInterfaceArray(res), nil
}
/**
 * @method
 * @name wazirx#fetchOHLCV
 * @see https://docs.wazirx.com/#kline-candlestick-data
 * @description fetches historical candlestick data containing the open, high, low, and close price, and the volume of a market
 * @param {string} symbol unified symbol of the market to fetch OHLCV data for
 * @param {string} timeframe the length of time each candle represents. Available values [1m,5m,15m,30m,1h,2h,4h,6h,12h,1d,1w]
 * @param {int} [since] timestamp in ms of the earliest candle to fetch
 * @param {int} [limit] the maximum amount of candles to fetch
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @param {int} [params.until] timestamp in s of the latest candle to fetch
 * @returns {int[][]} A list of candles ordered as timestamp, open, high, low, close, volume
 */
func (this *Wazirx) FetchOHLCV(symbol string, options ...FetchOHLCVOptions) ([]OHLCV, error) {

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
 * @name wazirx#fetchOrderBook
 * @see https://docs.wazirx.com/#order-book
 * @description fetches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
 * @param {string} symbol unified symbol of the market to fetch the order book for
 * @param {int} [limit] the maximum amount of order book entries to return
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @returns {object} A dictionary of [order book structures]{@link https://docs.ccxt.com/#/?id=order-book-structure} indexed by market symbols
 */
func (this *Wazirx) FetchOrderBook(symbol string, options ...FetchOrderBookOptions) (OrderBook, error) {

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
 * @name wazirx#fetchTicker
 * @see https://docs.wazirx.com/#24hr-ticker-price-change-statistics
 * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
 * @param {string} symbol unified symbol of the market to fetch the ticker for
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
 */
func (this *Wazirx) FetchTicker(symbol string, options ...FetchTickerOptions) (Ticker, error) {

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
/**
 * @method
 * @name wazirx#fetchTickers
 * @see https://docs.wazirx.com/#24hr-tickers-price-change-statistics
 * @description fetches price tickers for multiple markets, statistical information calculated over the past 24 hours for each market
 * @param {string[]|undefined} symbols unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
 */
func (this *Wazirx) FetchTickers(options ...FetchTickersOptions) (Tickers, error) {

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
 * @name wazirx#fetchTrades
 * @see https://docs.wazirx.com/#recent-trades-list
 * @description get the list of most recent trades for a particular symbol
 * @param {string} symbol unified symbol of the market to fetch trades for
 * @param {int} [since] timestamp in ms of the earliest trade to fetch
 * @param {int} [limit] the maximum amount of trades to fetch
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=public-trades}
 */
func (this *Wazirx) FetchTrades(symbol string, options ...FetchTradesOptions) ([]Trade, error) {

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
 * @name wazirx#fetchStatus
 * @see https://docs.wazirx.com/#system-status
 * @description the latest known information on the availability of the exchange API
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @returns {object} a [status structure]{@link https://docs.ccxt.com/#/?id=exchange-status-structure}
 */
func (this *Wazirx) FetchStatus(params ...interface{}) (map[string]interface{}, error) {
    res := <- this.Core.FetchStatus(params...)
    if IsError(res) {
        return map[string]interface{}{}, CreateReturnError(res)
    }
    return res.(map[string]interface{}), nil
}
/**
 * @method
 * @name wazirx#fetchTime
 * @see https://docs.wazirx.com/#check-server-time
 * @description fetches the current integer timestamp in milliseconds from the exchange server
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @returns {int} the current integer timestamp in milliseconds from the exchange server
 */
func (this *Wazirx) FetchTime(params ...interface{}) ( int64, error) {
    res := <- this.Core.FetchTime(params...)
    if IsError(res) {
        return -1, CreateReturnError(res)
    }
    return (res).(int64), nil
}
/**
 * @method
 * @name wazirx#fetchBalance
 * @see https://docs.wazirx.com/#fund-details-user_data
 * @description query for balance and get the amount of funds available for trading or funds locked in orders
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @returns {object} a [balance structure]{@link https://docs.ccxt.com/#/?id=balance-structure}
 */
func (this *Wazirx) FetchBalance(params ...interface{}) (Balances, error) {
    res := <- this.Core.FetchBalance(params...)
    if IsError(res) {
        return Balances{}, CreateReturnError(res)
    }
    return NewBalances(res), nil
}
/**
 * @method
 * @name wazirx#fetchOrders
 * @see https://docs.wazirx.com/#all-orders-user_data
 * @description fetches information on multiple orders made by the user
 * @param {string} symbol unified market symbol of the market orders were made in
 * @param {int} [since] the earliest time in ms to fetch orders for
 * @param {int} [limit] the maximum number of order structures to retrieve
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
 */
func (this *Wazirx) FetchOrders(options ...FetchOrdersOptions) ([]Order, error) {

    opts := FetchOrdersOptionsStruct{}

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
    res := <- this.Core.FetchOrders(symbol, since, limit, params)
    if IsError(res) {
        return nil, CreateReturnError(res)
    }
    return NewOrderArray(res), nil
}
/**
 * @method
 * @name wazirx#fetchOpenOrders
 * @see https://docs.wazirx.com/#current-open-orders-user_data
 * @description fetch all unfilled currently open orders
 * @param {string} symbol unified market symbol
 * @param {int} [since] the earliest time in ms to fetch open orders for
 * @param {int} [limit] the maximum number of  open orders structures to retrieve
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
 */
func (this *Wazirx) FetchOpenOrders(options ...FetchOpenOrdersOptions) ([]Order, error) {

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
 * @name wazirx#cancelAllOrders
 * @see https://docs.wazirx.com/#cancel-all-open-orders-on-a-symbol-trade
 * @description cancel all open orders in a market
 * @param {string} symbol unified market symbol of the market to cancel orders in
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @returns {object[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
 */
func (this *Wazirx) CancelAllOrders(options ...CancelAllOrdersOptions) ([]Order, error) {

    opts := CancelAllOrdersOptionsStruct{}

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
    res := <- this.Core.CancelAllOrders(symbol, params)
    if IsError(res) {
        return nil, CreateReturnError(res)
    }
    return NewOrderArray(res), nil
}
/**
 * @method
 * @name wazirx#cancelOrder
 * @see https://docs.wazirx.com/#cancel-order-trade
 * @description cancels an open order
 * @param {string} id order id
 * @param {string} symbol unified symbol of the market the order was made in
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
 */
func (this *Wazirx) CancelOrder(id string, options ...CancelOrderOptions) (Order, error) {

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
 * @name wazirx#createOrder
 * @see https://docs.wazirx.com/#new-order-trade
 * @description create a trade order
 * @param {string} symbol unified symbol of the market to create an order in
 * @param {string} type 'market' or 'limit'
 * @param {string} side 'buy' or 'sell'
 * @param {float} amount how much of currency you want to trade in units of base currency
 * @param {float} [price] the price at which the order is to be fulfilled, in units of the quote currency, ignored in market orders
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
 */
func (this *Wazirx) CreateOrder(symbol string, typeVar string, side string, amount float64, options ...CreateOrderOptions) (Order, error) {

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
 * @name wazirx#fetchDepositAddress
 * @description fetch the deposit address for a currency associated with this account
 * @see https://docs.wazirx.com/#deposit-address-supporting-network-user_data
 * @param {string} code unified currency code of the currency for the deposit address
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @param {string} [params.network] unified network code, you can get network from fetchCurrencies
 * @returns {object} an [address structure]{@link https://docs.ccxt.com/#/?id=address-structure}
 */
func (this *Wazirx) FetchDepositAddress(code string, options ...FetchDepositAddressOptions) (DepositAddress, error) {

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
 * @name wazirx#fetchWithdrawals
 * @description fetch all withdrawals made from an account
 * @see https://docs.wazirx.com/#withdraw-history-supporting-network-user_data
 * @param {string} code unified currency code
 * @param {int} [since] the earliest time in ms to fetch withdrawals for
 * @param {int} [limit] the maximum number of withdrawals structures to retrieve
 * @param {object} [params] extra parameters specific to the exchange API endpoint
 * @param {int} [params.until] the latest time in ms to fetch entries for
 * @returns {object[]} a list of [transaction structures]{@link https://docs.ccxt.com/#/?id=transaction-structure}
 */
func (this *Wazirx) FetchWithdrawals(options ...FetchWithdrawalsOptions) ([]Transaction, error) {

    opts := FetchWithdrawalsOptionsStruct{}

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
    res := <- this.Core.FetchWithdrawals(code, since, limit, params)
    if IsError(res) {
        return nil, CreateReturnError(res)
    }
    return NewTransactionArray(res), nil
}