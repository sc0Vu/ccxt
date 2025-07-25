// -------------------------------------------------------------------------------

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

// -------------------------------------------------------------------------------

package ccxt

func (this *bitmart) PublicGetSystemTime (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetSystemTime", args...)
}

func (this *bitmart) PublicGetSystemService (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetSystemService", args...)
}

func (this *bitmart) PublicGetSpotV1Currencies (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetSpotV1Currencies", args...)
}

func (this *bitmart) PublicGetSpotV1Symbols (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetSpotV1Symbols", args...)
}

func (this *bitmart) PublicGetSpotV1SymbolsDetails (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetSpotV1SymbolsDetails", args...)
}

func (this *bitmart) PublicGetSpotQuotationV3Tickers (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetSpotQuotationV3Tickers", args...)
}

func (this *bitmart) PublicGetSpotQuotationV3Ticker (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetSpotQuotationV3Ticker", args...)
}

func (this *bitmart) PublicGetSpotQuotationV3LiteKlines (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetSpotQuotationV3LiteKlines", args...)
}

func (this *bitmart) PublicGetSpotQuotationV3Klines (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetSpotQuotationV3Klines", args...)
}

func (this *bitmart) PublicGetSpotQuotationV3Books (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetSpotQuotationV3Books", args...)
}

func (this *bitmart) PublicGetSpotQuotationV3Trades (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetSpotQuotationV3Trades", args...)
}

func (this *bitmart) PublicGetSpotV1Ticker (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetSpotV1Ticker", args...)
}

func (this *bitmart) PublicGetSpotV2Ticker (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetSpotV2Ticker", args...)
}

func (this *bitmart) PublicGetSpotV1TickerDetail (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetSpotV1TickerDetail", args...)
}

func (this *bitmart) PublicGetSpotV1Steps (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetSpotV1Steps", args...)
}

func (this *bitmart) PublicGetSpotV1SymbolsKline (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetSpotV1SymbolsKline", args...)
}

func (this *bitmart) PublicGetSpotV1SymbolsBook (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetSpotV1SymbolsBook", args...)
}

func (this *bitmart) PublicGetSpotV1SymbolsTrades (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetSpotV1SymbolsTrades", args...)
}

func (this *bitmart) PublicGetContractV1Tickers (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetContractV1Tickers", args...)
}

func (this *bitmart) PublicGetContractPublicDetails (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetContractPublicDetails", args...)
}

func (this *bitmart) PublicGetContractPublicDepth (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetContractPublicDepth", args...)
}

func (this *bitmart) PublicGetContractPublicOpenInterest (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetContractPublicOpenInterest", args...)
}

func (this *bitmart) PublicGetContractPublicFundingRate (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetContractPublicFundingRate", args...)
}

func (this *bitmart) PublicGetContractPublicFundingRateHistory (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetContractPublicFundingRateHistory", args...)
}

func (this *bitmart) PublicGetContractPublicKline (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetContractPublicKline", args...)
}

func (this *bitmart) PublicGetAccountV1Currencies (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetAccountV1Currencies", args...)
}

func (this *bitmart) PublicGetContractPublicMarkpriceKline (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetContractPublicMarkpriceKline", args...)
}

func (this *bitmart) PrivateGetAccountSubAccountV1TransferList (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetAccountSubAccountV1TransferList", args...)
}

func (this *bitmart) PrivateGetAccountSubAccountV1TransferHistory (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetAccountSubAccountV1TransferHistory", args...)
}

func (this *bitmart) PrivateGetAccountSubAccountMainV1Wallet (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetAccountSubAccountMainV1Wallet", args...)
}

func (this *bitmart) PrivateGetAccountSubAccountMainV1SubaccountList (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetAccountSubAccountMainV1SubaccountList", args...)
}

func (this *bitmart) PrivateGetAccountContractSubAccountMainV1Wallet (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetAccountContractSubAccountMainV1Wallet", args...)
}

func (this *bitmart) PrivateGetAccountContractSubAccountMainV1TransferList (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetAccountContractSubAccountMainV1TransferList", args...)
}

func (this *bitmart) PrivateGetAccountContractSubAccountV1TransferHistory (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetAccountContractSubAccountV1TransferHistory", args...)
}

func (this *bitmart) PrivateGetAccountV1Wallet (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetAccountV1Wallet", args...)
}

func (this *bitmart) PrivateGetAccountV1Currencies (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetAccountV1Currencies", args...)
}

func (this *bitmart) PrivateGetSpotV1Wallet (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetSpotV1Wallet", args...)
}

func (this *bitmart) PrivateGetAccountV1DepositAddress (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetAccountV1DepositAddress", args...)
}

func (this *bitmart) PrivateGetAccountV1WithdrawCharge (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetAccountV1WithdrawCharge", args...)
}

func (this *bitmart) PrivateGetAccountV2DepositWithdrawHistory (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetAccountV2DepositWithdrawHistory", args...)
}

func (this *bitmart) PrivateGetAccountV1DepositWithdrawDetail (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetAccountV1DepositWithdrawDetail", args...)
}

func (this *bitmart) PrivateGetAccountV1WithdrawAddressList (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetAccountV1WithdrawAddressList", args...)
}

func (this *bitmart) PrivateGetSpotV1OrderDetail (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetSpotV1OrderDetail", args...)
}

func (this *bitmart) PrivateGetSpotV2Orders (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetSpotV2Orders", args...)
}

func (this *bitmart) PrivateGetSpotV1Trades (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetSpotV1Trades", args...)
}

func (this *bitmart) PrivateGetSpotV2Trades (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetSpotV2Trades", args...)
}

func (this *bitmart) PrivateGetSpotV3Orders (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetSpotV3Orders", args...)
}

func (this *bitmart) PrivateGetSpotV2OrderDetail (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetSpotV2OrderDetail", args...)
}

func (this *bitmart) PrivateGetSpotV1MarginIsolatedBorrowRecord (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetSpotV1MarginIsolatedBorrowRecord", args...)
}

func (this *bitmart) PrivateGetSpotV1MarginIsolatedRepayRecord (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetSpotV1MarginIsolatedRepayRecord", args...)
}

func (this *bitmart) PrivateGetSpotV1MarginIsolatedPairs (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetSpotV1MarginIsolatedPairs", args...)
}

func (this *bitmart) PrivateGetSpotV1MarginIsolatedAccount (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetSpotV1MarginIsolatedAccount", args...)
}

func (this *bitmart) PrivateGetSpotV1TradeFee (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetSpotV1TradeFee", args...)
}

func (this *bitmart) PrivateGetSpotV1UserFee (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetSpotV1UserFee", args...)
}

func (this *bitmart) PrivateGetSpotV1BrokerRebate (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetSpotV1BrokerRebate", args...)
}

func (this *bitmart) PrivateGetContractPrivateAssetsDetail (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetContractPrivateAssetsDetail", args...)
}

func (this *bitmart) PrivateGetContractPrivateOrder (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetContractPrivateOrder", args...)
}

func (this *bitmart) PrivateGetContractPrivateOrderHistory (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetContractPrivateOrderHistory", args...)
}

func (this *bitmart) PrivateGetContractPrivatePosition (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetContractPrivatePosition", args...)
}

func (this *bitmart) PrivateGetContractPrivatePositionV2 (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetContractPrivatePositionV2", args...)
}

func (this *bitmart) PrivateGetContractPrivateGetOpenOrders (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetContractPrivateGetOpenOrders", args...)
}

func (this *bitmart) PrivateGetContractPrivateCurrentPlanOrder (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetContractPrivateCurrentPlanOrder", args...)
}

func (this *bitmart) PrivateGetContractPrivateTrades (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetContractPrivateTrades", args...)
}

func (this *bitmart) PrivateGetContractPrivatePositionRisk (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetContractPrivatePositionRisk", args...)
}

func (this *bitmart) PrivateGetContractPrivateAffilateRebateList (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetContractPrivateAffilateRebateList", args...)
}

func (this *bitmart) PrivateGetContractPrivateAffilateTradeList (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetContractPrivateAffilateTradeList", args...)
}

func (this *bitmart) PrivateGetContractPrivateTransactionHistory (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetContractPrivateTransactionHistory", args...)
}

func (this *bitmart) PrivateGetContractPrivateGetPositionMode (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetContractPrivateGetPositionMode", args...)
}

func (this *bitmart) PrivatePostAccountSubAccountMainV1SubToMain (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostAccountSubAccountMainV1SubToMain", args...)
}

func (this *bitmart) PrivatePostAccountSubAccountSubV1SubToMain (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostAccountSubAccountSubV1SubToMain", args...)
}

func (this *bitmart) PrivatePostAccountSubAccountMainV1MainToSub (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostAccountSubAccountMainV1MainToSub", args...)
}

func (this *bitmart) PrivatePostAccountSubAccountSubV1SubToSub (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostAccountSubAccountSubV1SubToSub", args...)
}

func (this *bitmart) PrivatePostAccountSubAccountMainV1SubToSub (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostAccountSubAccountMainV1SubToSub", args...)
}

func (this *bitmart) PrivatePostAccountContractSubAccountMainV1SubToMain (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostAccountContractSubAccountMainV1SubToMain", args...)
}

func (this *bitmart) PrivatePostAccountContractSubAccountMainV1MainToSub (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostAccountContractSubAccountMainV1MainToSub", args...)
}

func (this *bitmart) PrivatePostAccountContractSubAccountSubV1SubToMain (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostAccountContractSubAccountSubV1SubToMain", args...)
}

func (this *bitmart) PrivatePostAccountV1WithdrawApply (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostAccountV1WithdrawApply", args...)
}

func (this *bitmart) PrivatePostSpotV1SubmitOrder (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostSpotV1SubmitOrder", args...)
}

func (this *bitmart) PrivatePostSpotV1BatchOrders (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostSpotV1BatchOrders", args...)
}

func (this *bitmart) PrivatePostSpotV2CancelOrder (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostSpotV2CancelOrder", args...)
}

func (this *bitmart) PrivatePostSpotV1CancelOrders (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostSpotV1CancelOrders", args...)
}

func (this *bitmart) PrivatePostSpotV4QueryOrder (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostSpotV4QueryOrder", args...)
}

func (this *bitmart) PrivatePostSpotV4QueryClientOrder (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostSpotV4QueryClientOrder", args...)
}

func (this *bitmart) PrivatePostSpotV4QueryOpenOrders (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostSpotV4QueryOpenOrders", args...)
}

func (this *bitmart) PrivatePostSpotV4QueryHistoryOrders (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostSpotV4QueryHistoryOrders", args...)
}

func (this *bitmart) PrivatePostSpotV4QueryTrades (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostSpotV4QueryTrades", args...)
}

func (this *bitmart) PrivatePostSpotV4QueryOrderTrades (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostSpotV4QueryOrderTrades", args...)
}

func (this *bitmart) PrivatePostSpotV4CancelOrders (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostSpotV4CancelOrders", args...)
}

func (this *bitmart) PrivatePostSpotV4CancelAll (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostSpotV4CancelAll", args...)
}

func (this *bitmart) PrivatePostSpotV4BatchOrders (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostSpotV4BatchOrders", args...)
}

func (this *bitmart) PrivatePostSpotV3CancelOrder (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostSpotV3CancelOrder", args...)
}

func (this *bitmart) PrivatePostSpotV2BatchOrders (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostSpotV2BatchOrders", args...)
}

func (this *bitmart) PrivatePostSpotV2SubmitOrder (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostSpotV2SubmitOrder", args...)
}

func (this *bitmart) PrivatePostSpotV1MarginSubmitOrder (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostSpotV1MarginSubmitOrder", args...)
}

func (this *bitmart) PrivatePostSpotV1MarginIsolatedBorrow (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostSpotV1MarginIsolatedBorrow", args...)
}

func (this *bitmart) PrivatePostSpotV1MarginIsolatedRepay (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostSpotV1MarginIsolatedRepay", args...)
}

func (this *bitmart) PrivatePostSpotV1MarginIsolatedTransfer (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostSpotV1MarginIsolatedTransfer", args...)
}

func (this *bitmart) PrivatePostAccountV1TransferContractList (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostAccountV1TransferContractList", args...)
}

func (this *bitmart) PrivatePostAccountV1TransferContract (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostAccountV1TransferContract", args...)
}

func (this *bitmart) PrivatePostContractPrivateSubmitOrder (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostContractPrivateSubmitOrder", args...)
}

func (this *bitmart) PrivatePostContractPrivateCancelOrder (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostContractPrivateCancelOrder", args...)
}

func (this *bitmart) PrivatePostContractPrivateCancelOrders (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostContractPrivateCancelOrders", args...)
}

func (this *bitmart) PrivatePostContractPrivateSubmitPlanOrder (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostContractPrivateSubmitPlanOrder", args...)
}

func (this *bitmart) PrivatePostContractPrivateCancelPlanOrder (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostContractPrivateCancelPlanOrder", args...)
}

func (this *bitmart) PrivatePostContractPrivateSubmitLeverage (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostContractPrivateSubmitLeverage", args...)
}

func (this *bitmart) PrivatePostContractPrivateSubmitTpSlOrder (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostContractPrivateSubmitTpSlOrder", args...)
}

func (this *bitmart) PrivatePostContractPrivateModifyPlanOrder (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostContractPrivateModifyPlanOrder", args...)
}

func (this *bitmart) PrivatePostContractPrivateModifyPresetPlanOrder (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostContractPrivateModifyPresetPlanOrder", args...)
}

func (this *bitmart) PrivatePostContractPrivateModifyLimitOrder (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostContractPrivateModifyLimitOrder", args...)
}

func (this *bitmart) PrivatePostContractPrivateModifyTpSlOrder (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostContractPrivateModifyTpSlOrder", args...)
}

func (this *bitmart) PrivatePostContractPrivateSubmitTrailOrder (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostContractPrivateSubmitTrailOrder", args...)
}

func (this *bitmart) PrivatePostContractPrivateCancelTrailOrder (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostContractPrivateCancelTrailOrder", args...)
}

func (this *bitmart) PrivatePostContractPrivateSetPositionMode (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostContractPrivateSetPositionMode", args...)
}
