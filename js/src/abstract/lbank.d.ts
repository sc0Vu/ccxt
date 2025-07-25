import { implicitReturnType } from '../base/types.js';
import { Exchange as _Exchange } from '../base/Exchange.js';
interface Exchange {
    spotPublicGetCurrencyPairs(params?: {}): Promise<implicitReturnType>;
    spotPublicGetAccuracy(params?: {}): Promise<implicitReturnType>;
    spotPublicGetUsdToCny(params?: {}): Promise<implicitReturnType>;
    spotPublicGetAssetConfigs(params?: {}): Promise<implicitReturnType>;
    spotPublicGetWithdrawConfigs(params?: {}): Promise<implicitReturnType>;
    spotPublicGetTimestamp(params?: {}): Promise<implicitReturnType>;
    spotPublicGetTicker24hr(params?: {}): Promise<implicitReturnType>;
    spotPublicGetTicker(params?: {}): Promise<implicitReturnType>;
    spotPublicGetDepth(params?: {}): Promise<implicitReturnType>;
    spotPublicGetIncrDepth(params?: {}): Promise<implicitReturnType>;
    spotPublicGetTrades(params?: {}): Promise<implicitReturnType>;
    spotPublicGetKline(params?: {}): Promise<implicitReturnType>;
    spotPublicGetSupplementSystemPing(params?: {}): Promise<implicitReturnType>;
    spotPublicGetSupplementIncrDepth(params?: {}): Promise<implicitReturnType>;
    spotPublicGetSupplementTrades(params?: {}): Promise<implicitReturnType>;
    spotPublicGetSupplementTickerPrice(params?: {}): Promise<implicitReturnType>;
    spotPublicGetSupplementTickerBookTicker(params?: {}): Promise<implicitReturnType>;
    spotPublicPostSupplementSystemStatus(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostUserInfo(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostSubscribeGetKey(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostSubscribeRefreshKey(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostSubscribeDestroyKey(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostGetDepositAddress(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostDepositHistory(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostCreateOrder(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostBatchCreateOrder(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostCancelOrder(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostCancelClientOrders(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostOrdersInfo(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostOrdersInfoHistory(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostOrderTransactionDetail(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostTransactionHistory(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostOrdersInfoNoDeal(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostWithdraw(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostWithdrawCancel(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostWithdraws(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostSupplementUserInfo(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostSupplementWithdraw(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostSupplementDepositHistory(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostSupplementWithdraws(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostSupplementGetDepositAddress(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostSupplementAssetDetail(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostSupplementCustomerTradeFee(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostSupplementApiRestrictions(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostSupplementSystemPing(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostSupplementCreateOrderTest(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostSupplementCreateOrder(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostSupplementCancelOrder(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostSupplementCancelOrderBySymbol(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostSupplementOrdersInfo(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostSupplementOrdersInfoNoDeal(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostSupplementOrdersInfoHistory(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostSupplementUserInfoAccount(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostSupplementTransactionHistory(params?: {}): Promise<implicitReturnType>;
    contractPublicGetCfdOpenApiV1PubGetTime(params?: {}): Promise<implicitReturnType>;
    contractPublicGetCfdOpenApiV1PubInstrument(params?: {}): Promise<implicitReturnType>;
    contractPublicGetCfdOpenApiV1PubMarketData(params?: {}): Promise<implicitReturnType>;
    contractPublicGetCfdOpenApiV1PubMarketOrder(params?: {}): Promise<implicitReturnType>;
}
declare abstract class Exchange extends _Exchange {
}
export default Exchange;
