import os
import sys

root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
sys.path.append(root)

# ----------------------------------------------------------------------------

# PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
# https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

# ----------------------------------------------------------------------------
# -*- coding: utf-8 -*-

from ccxt.test.exchange.base import test_shared_methods  # noqa E402

def test_borrow_rate(exchange, skipped_properties, method, entry, requested_code):
    format = {
        'info': {},
        'currency': 'USDT',
        'timestamp': 1638230400000,
        'datetime': '2021-11-30T00:00:00.000Z',
        'rate': exchange.parse_number('0.0006'),
        'period': 86400000,
    }
    test_shared_methods.assert_structure(exchange, skipped_properties, method, entry, format)
    test_shared_methods.assert_timestamp_and_datetime(exchange, skipped_properties, method, entry)
    test_shared_methods.assert_currency_code(exchange, skipped_properties, method, entry, entry['currency'], requested_code)
    #
    # assert (borrowRate['period'] === 86400000 || borrowRate['period'] === 3600000) # Milliseconds in an hour or a day
    test_shared_methods.assert_greater(exchange, skipped_properties, method, entry, 'period', '0')
    test_shared_methods.assert_greater(exchange, skipped_properties, method, entry, 'rate', '0')
