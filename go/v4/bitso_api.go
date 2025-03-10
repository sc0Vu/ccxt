// -------------------------------------------------------------------------------

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

// -------------------------------------------------------------------------------

package ccxt

func (this *bitso) PublicGetAvailableBooks (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("publicGetAvailableBooks", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PublicGetTicker (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("publicGetTicker", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PublicGetOrderBook (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("publicGetOrderBook", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PublicGetTrades (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("publicGetTrades", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PublicGetOhlc (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("publicGetOhlc", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivateGetAccountStatus (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privateGetAccountStatus", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivateGetBalance (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privateGetBalance", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivateGetFees (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privateGetFees", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivateGetFundings (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privateGetFundings", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivateGetFundingsFid (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privateGetFundingsFid", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivateGetFundingDestination (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privateGetFundingDestination", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivateGetKycDocuments (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privateGetKycDocuments", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivateGetLedger (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privateGetLedger", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivateGetLedgerTrades (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privateGetLedgerTrades", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivateGetLedgerFees (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privateGetLedgerFees", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivateGetLedgerFundings (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privateGetLedgerFundings", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivateGetLedgerWithdrawals (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privateGetLedgerWithdrawals", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivateGetMxBankCodes (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privateGetMxBankCodes", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivateGetOpenOrders (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privateGetOpenOrders", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivateGetOrderTradesOid (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privateGetOrderTradesOid", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivateGetOrdersOid (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privateGetOrdersOid", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivateGetUserTrades (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privateGetUserTrades", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivateGetUserTradesTid (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privateGetUserTradesTid", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivateGetWithdrawals (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privateGetWithdrawals", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivateGetWithdrawalsWid (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privateGetWithdrawalsWid", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivatePostBitcoinWithdrawal (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privatePostBitcoinWithdrawal", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivatePostDebitCardWithdrawal (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privatePostDebitCardWithdrawal", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivatePostEtherWithdrawal (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privatePostEtherWithdrawal", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivatePostOrders (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privatePostOrders", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivatePostPhoneNumber (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privatePostPhoneNumber", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivatePostPhoneVerification (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privatePostPhoneVerification", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivatePostPhoneWithdrawal (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privatePostPhoneWithdrawal", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivatePostSpeiWithdrawal (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privatePostSpeiWithdrawal", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivatePostRippleWithdrawal (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privatePostRippleWithdrawal", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivatePostBcashWithdrawal (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privatePostBcashWithdrawal", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivatePostLitecoinWithdrawal (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privatePostLitecoinWithdrawal", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivateDeleteOrders (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privateDeleteOrders", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivateDeleteOrdersOid (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privateDeleteOrdersOid", parameters))
       PanicOnError(ch)
   }()
   return ch
}

func (this *bitso) PrivateDeleteOrdersAll (args ...interface{}) <-chan interface{} {
   parameters := GetArg(args, 0, nil)
   ch := make(chan interface{})
   go func() {
       defer close(ch)
       defer func() {
           if r := recover(); r != nil {
               ch <- "panic:" + ToString(r)
           }
       }()
       ch <- (<-this.callEndpoint ("privateDeleteOrdersAll", parameters))
       PanicOnError(ch)
   }()
   return ch
}
