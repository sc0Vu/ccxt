<?php
namespace ccxt;

// ----------------------------------------------------------------------------

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

// -----------------------------------------------------------------------------
include_once PATH_TO_CCXT . '/test/exchange/base/test_order.php';

function test_fetch_orders($exchange, $skipped_properties, $symbol) {
    $method = 'fetchOrders';
    $orders = $exchange->fetch_orders($symbol);
    assert(gettype($orders) === 'array' && array_is_list($orders), $exchange->id . ' ' . $method . ' must return an array, returned ' . $exchange->json($orders));
    assert_non_emtpy_array($exchange, $skipped_properties, $method, $orders, $symbol);
    $now = $exchange->milliseconds();
    for ($i = 0; $i < count($orders); $i++) {
        test_order($exchange, $skipped_properties, $method, $orders[$i], $symbol, $now);
    }
    assert_timestamp_order($exchange, $method, $symbol, $orders);
    return true;
}
