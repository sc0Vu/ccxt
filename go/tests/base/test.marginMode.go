package base
import "github.com/ccxt/ccxt/go/v4"

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code


    func TestMarginMode(exchange ccxt.ICoreExchange, skippedProperties interface{}, method interface{}, entry interface{})  {
        var format interface{} = map[string]interface{} {
            "info": map[string]interface{} {},
            "symbol": "BTC/USDT:USDT",
            "marginMode": "cross",
        }
        var emptyAllowedFor interface{} = []interface{}{"symbol"}
        AssertStructure(exchange, skippedProperties, method, entry, format, emptyAllowedFor)
    }
