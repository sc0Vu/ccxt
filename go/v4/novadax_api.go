// -------------------------------------------------------------------------------

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

// -------------------------------------------------------------------------------

package ccxt

func (this *novadax) PublicGetCommonSymbol (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetCommonSymbol", args...)
}

func (this *novadax) PublicGetCommonSymbols (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetCommonSymbols", args...)
}

func (this *novadax) PublicGetCommonTimestamp (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetCommonTimestamp", args...)
}

func (this *novadax) PublicGetMarketTickers (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetMarketTickers", args...)
}

func (this *novadax) PublicGetMarketTicker (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetMarketTicker", args...)
}

func (this *novadax) PublicGetMarketDepth (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetMarketDepth", args...)
}

func (this *novadax) PublicGetMarketTrades (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetMarketTrades", args...)
}

func (this *novadax) PublicGetMarketKlineHistory (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("publicGetMarketKlineHistory", args...)
}

func (this *novadax) PrivateGetOrdersGet (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetOrdersGet", args...)
}

func (this *novadax) PrivateGetOrdersList (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetOrdersList", args...)
}

func (this *novadax) PrivateGetOrdersFill (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetOrdersFill", args...)
}

func (this *novadax) PrivateGetOrdersFills (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetOrdersFills", args...)
}

func (this *novadax) PrivateGetAccountGetBalance (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetAccountGetBalance", args...)
}

func (this *novadax) PrivateGetAccountSubs (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetAccountSubs", args...)
}

func (this *novadax) PrivateGetAccountSubsBalance (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetAccountSubsBalance", args...)
}

func (this *novadax) PrivateGetAccountSubsTransferRecord (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetAccountSubsTransferRecord", args...)
}

func (this *novadax) PrivateGetWalletQueryDepositWithdraw (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privateGetWalletQueryDepositWithdraw", args...)
}

func (this *novadax) PrivatePostOrdersCreate (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostOrdersCreate", args...)
}

func (this *novadax) PrivatePostOrdersBatchCreate (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostOrdersBatchCreate", args...)
}

func (this *novadax) PrivatePostOrdersCancel (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostOrdersCancel", args...)
}

func (this *novadax) PrivatePostOrdersBatchCancel (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostOrdersBatchCancel", args...)
}

func (this *novadax) PrivatePostOrdersCancelBySymbol (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostOrdersCancelBySymbol", args...)
}

func (this *novadax) PrivatePostAccountSubsTransfer (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostAccountSubsTransfer", args...)
}

func (this *novadax) PrivatePostWalletWithdrawCoin (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostWalletWithdrawCoin", args...)
}

func (this *novadax) PrivatePostAccountWithdrawCoin (args ...interface{}) <-chan interface{} {
   return this.callEndpointAsync("privatePostAccountWithdrawCoin", args...)
}
