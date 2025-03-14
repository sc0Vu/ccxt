<?php

namespace ccxt\pro;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

use Exception; // a common import
use ccxt\ExchangeError;
use ccxt\NotSupported;
use \React\Async;
use \React\Promise\PromiseInterface;

class probit extends \ccxt\async\probit {

    public function describe(): mixed {
        return $this->deep_extend(parent::describe(), array(
            'has' => array(
                'ws' => true,
                'watchBalance' => true,
                'watchTicker' => true,
                'watchTickers' => false,
                'watchTrades' => true,
                'watchTradesForSymbols' => false,
                'watchMyTrades' => true,
                'watchOrders' => true,
                'watchOrderBook' => true,
                'watchOHLCV' => false,
            ),
            'urls' => array(
                'api' => array(
                    'ws' => 'wss://api.probit.com/api/exchange/v1/ws',
                ),
                'test' => array(
                    'ws' => 'wss://demo-api.probit.com/api/exchange/v1/ws',
                ),
            ),
            'options' => array(
                'watchOrderBook' => array(
                    'filter' => 'order_books_l2',
                    'interval' => 100, // or 500
                ),
            ),
            'streaming' => array(
            ),
        ));
    }

    public function watch_balance($params = array ()): PromiseInterface {
        return Async\async(function () use ($params) {
            /**
             * watch balance and get the amount of funds available for trading or funds locked in orders
             *
             * @see https://docs-en.probit.com/reference/balance-1
             *
             * @param {array} [$params] extra parameters specific to the exchange API endpoint
             * @return {array} a ~@link https://docs.ccxt.com/#/?id=balance-structure balance structure~
             */
            Async\await($this->authenticate($params));
            $messageHash = 'balance';
            return Async\await($this->subscribe_private($messageHash, 'balance', $params));
        }) ();
    }

    public function handle_balance(Client $client, $message) {
        //
        //     {
        //         "channel" => "balance",
        //         "reset" => false,
        //         "data" => {
        //             "USDT" => {
        //                 "available" => "15",
        //                 "total" => "15"
        //             }
        //         }
        //     }
        //
        $messageHash = 'balance';
        $this->parse_ws_balance($message);
        $client->resolve ($this->balance, $messageHash);
    }

    public function parse_ws_balance($message) {
        //
        //     {
        //         "channel" => "balance",
        //         "reset" => false,
        //         "data" => {
        //             "USDT" => {
        //                 "available" => "15",
        //                 "total" => "15"
        //             }
        //         }
        //     }
        //
        $reset = $this->safe_bool($message, 'reset', false);
        $data = $this->safe_value($message, 'data', array());
        $currencyIds = is_array($data) ? array_keys($data) : array();
        if ($reset) {
            $this->balance = array();
        }
        for ($i = 0; $i < count($currencyIds); $i++) {
            $currencyId = $currencyIds[$i];
            $entry = $data[$currencyId];
            $code = $this->safe_currency_code($currencyId);
            $account = $this->account();
            $account['free'] = $this->safe_string($entry, 'available');
            $account['total'] = $this->safe_string($entry, 'total');
            $this->balance[$code] = $account;
        }
        $this->balance = $this->safe_balance($this->balance);
    }

    public function watch_ticker(string $symbol, $params = array ()): PromiseInterface {
        return Async\async(function () use ($symbol, $params) {
            /**
             * watches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
             *
             * @see https://docs-en.probit.com/reference/marketdata
             *
             * @param {string} $symbol unified $symbol of the market to fetch the ticker for
             * @param {array} [$params] extra parameters specific to the exchange API endpoint
             * @param {int} [$params->interval] Unit time to synchronize market information (ms). Available units => 100, 500
             * @return {array} a ~@link https://docs.ccxt.com/#/?id=ticker-structure ticker structure~
             */
            $channel = 'ticker';
            return Async\await($this->subscribe_public('watchTicker', $symbol, 'ticker', $channel, $params));
        }) ();
    }

    public function handle_ticker(Client $client, $message) {
        //
        //     {
        //         "channel" => "marketdata",
        //         "market_id" => "BTC-USDT",
        //         "status" => "ok",
        //         "lag" => 0,
        //         "ticker" => array(
        //             "time" => "2022-07-21T14:18:04.000Z",
        //             "last" => "22591.3",
        //             "low" => "22500.1",
        //             "high" => "39790.7",
        //             "change" => "-1224",
        //             "base_volume" => "1002.32005445",
        //             "quote_volume" => "23304489.385351021"
        //         ),
        //         "reset" => true
        //     }
        //
        $marketId = $this->safe_string($message, 'market_id');
        $symbol = $this->safe_symbol($marketId);
        $ticker = $this->safe_value($message, 'ticker', array());
        $market = $this->safe_market($marketId);
        $parsedTicker = $this->parse_ticker($ticker, $market);
        $messageHash = 'ticker:' . $symbol;
        $this->tickers[$symbol] = $parsedTicker;
        $client->resolve ($parsedTicker, $messageHash);
    }

    public function watch_trades(string $symbol, ?int $since = null, ?int $limit = null, $params = array ()): PromiseInterface {
        return Async\async(function () use ($symbol, $since, $limit, $params) {
            /**
             * get the list of most recent $trades for a particular $symbol
             *
             * @see https://docs-en.probit.com/reference/trade_history
             *
             * @param {string} $symbol unified $symbol of the market to fetch $trades for
             * @param {int} [$since] timestamp in ms of the earliest trade to fetch
             * @param {int} [$limit] the maximum amount of $trades to fetch
             * @param {array} [$params] extra parameters specific to the exchange API endpoint
             * @param {int} [$params->interval] Unit time to synchronize market information (ms). Available units => 100, 500
             * @return {array[]} a list of ~@link https://docs.ccxt.com/#/?id=public-$trades trade structures~
             */
            $channel = 'recent_trades';
            $symbol = $this->safe_symbol($symbol);
            $trades = Async\await($this->subscribe_public('watchTrades', $symbol, 'trades', $channel, $params));
            if ($this->newUpdates) {
                $limit = $trades->getLimit ($symbol, $limit);
            }
            return $this->filter_by_symbol_since_limit($trades, $symbol, $since, $limit, true);
        }) ();
    }

    public function handle_trades(Client $client, $message) {
        //
        //     {
        //         "channel" => "marketdata",
        //         "market_id" => "BTC-USDT",
        //         "status" => "ok",
        //         "lag" => 0,
        //         "recent_trades" => array(
        //             {
        //                 "id" => "BTC-USDT:8010233",
        //                 "price" => "22701.4",
        //                 "quantity" => "0.011011",
        //                 "time" => "2022-07-21T13:40:40.983Z",
        //                 "side" => "buy",
        //                 "tick_direction" => "up"
        //             }
        //             ...
        //         )
        //         "reset" => true
        //     }
        //
        $marketId = $this->safe_string($message, 'market_id');
        $symbol = $this->safe_symbol($marketId);
        $market = $this->safe_market($marketId);
        $trades = $this->safe_value($message, 'recent_trades', array());
        if ($this->safe_bool($message, 'reset', false)) {
            return; // see comment in handleMessage
        }
        $messageHash = 'trades:' . $symbol;
        $stored = $this->safe_value($this->trades, $symbol);
        if ($stored === null) {
            $limit = $this->safe_integer($this->options, 'tradesLimit', 1000);
            $stored = new ArrayCache ($limit);
            $this->trades[$symbol] = $stored;
        }
        for ($i = 0; $i < count($trades); $i++) {
            $trade = $trades[$i];
            $parsed = $this->parse_trade($trade, $market);
            $stored->append ($parsed);
        }
        $this->trades[$symbol] = $stored;
        $client->resolve ($this->trades[$symbol], $messageHash);
    }

    public function watch_my_trades(?string $symbol = null, ?int $since = null, ?int $limit = null, $params = array ()): PromiseInterface {
        return Async\async(function () use ($symbol, $since, $limit, $params) {
            /**
             * get the list of $trades associated with the user
             *
             * @see https://docs-en.probit.com/reference/trade_history
             *
             * @param {string} $symbol unified $symbol of the market to fetch $trades for
             * @param {int} [$since] timestamp in ms of the earliest trade to fetch
             * @param {int} [$limit] the maximum amount of $trades to fetch
             * @param {array} [$params] extra parameters specific to the exchange API endpoint
             * @return {array[]} a list of ~@link https://docs.ccxt.com/#/?id=public-$trades trade structures~
             */
            Async\await($this->load_markets());
            Async\await($this->authenticate($params));
            $messageHash = 'trades';
            if ($symbol !== null) {
                $symbol = $this->safe_symbol($symbol);
                $messageHash = $messageHash . ':' . $symbol;
            }
            $trades = Async\await($this->subscribe_private($messageHash, 'trade_history', $params));
            if ($this->newUpdates) {
                $limit = $trades->getLimit ($symbol, $limit);
            }
            return $this->filter_by_symbol_since_limit($trades, $symbol, $since, $limit, true);
        }) ();
    }

    public function handle_my_trades(Client $client, $message) {
        //
        //     {
        //         "channel" => "trade_history",
        //         "reset" => false,
        //         "data" => [array(
        //             "id" => "BTC-USDT:8010722",
        //             "order_id" => "4124999207",
        //             "side" => "buy",
        //             "fee_amount" => "0.0134999868096",
        //             "fee_currency_id" => "USDT",
        //             "status" => "settled",
        //             "price" => "23136.7",
        //             "quantity" => "0.00032416",
        //             "cost" => "7.499992672",
        //             "time" => "2022-07-21T17:09:33.056Z",
        //             "market_id" => "BTC-USDT"
        //         )]
        //     }
        //
        $rawTrades = $this->safe_value($message, 'data', array());
        $length = count($rawTrades);
        if ($length === 0) {
            return;
        }
        if ($this->safe_bool($message, 'reset', false)) {
            return; // see comment in handleMessage
        }
        $messageHash = 'trades';
        $stored = $this->myTrades;
        if ($stored === null) {
            $limit = $this->safe_integer($this->options, 'tradesLimit', 1000);
            $stored = new ArrayCacheBySymbolById ($limit);
            $this->myTrades = $stored;
        }
        $trades = $this->parse_trades($rawTrades);
        $tradeSymbols = array();
        for ($j = 0; $j < count($trades); $j++) {
            $trade = $trades[$j];
            // don't include 'executed' state, because it's just blanket state of the $trade, emited before actual $trade event
            if ($this->safe_string($trade['info'], 'status') === 'executed') {
                continue;
            }
            $tradeSymbols[$trade['symbol']] = true;
            $stored->append ($trade);
        }
        $unique = is_array($tradeSymbols) ? array_keys($tradeSymbols) : array();
        $uniqueLength = count($unique);
        if ($uniqueLength === 0) {
            return;
        }
        for ($i = 0; $i < count($unique); $i++) {
            $symbol = $unique[$i];
            $symbolSpecificMessageHash = $messageHash . ':' . $symbol;
            $client->resolve ($stored, $symbolSpecificMessageHash);
        }
        $client->resolve ($stored, $messageHash);
    }

    public function watch_orders(?string $symbol = null, ?int $since = null, ?int $limit = null, $params = array ()): PromiseInterface {
        return Async\async(function () use ($symbol, $since, $limit, $params) {
            /**
             * watches information on an order made by the user
             *
             * @see https://docs-en.probit.com/reference/open_order
             *
             * @param {string} $symbol unified $symbol of the market the order was made in
             * @param {int} [$since] timestamp in ms of the earliest order to watch
             * @param {int} [$limit] the maximum amount of $orders to watch
             * @param {array} [$params] extra parameters specific to the exchange API endpoint
             * @param {string} [$params->channel] choose what channel to use. Can open_order or order_history.
             * @return {array} An ~@link https://docs.ccxt.com/#/?id=order-structure order structure~
             */
            Async\await($this->authenticate($params));
            $messageHash = 'orders';
            if ($symbol !== null) {
                $symbol = $this->safe_symbol($symbol);
                $messageHash = $messageHash . ':' . $symbol;
            }
            $orders = Async\await($this->subscribe_private($messageHash, 'open_order', $params));
            if ($this->newUpdates) {
                $limit = $orders->getLimit ($symbol, $limit);
            }
            return $this->filter_by_symbol_since_limit($orders, $symbol, $since, $limit, true);
        }) ();
    }

    public function handle_orders(Client $client, $message) {
        //
        //     {
        //         "channel" => "order_history",
        //         "reset" => true,
        //         "data" => [array(
        //                 "id" => "4124999207",
        //                 "user_id" => "633dc56a-621b-4680-8a4e-85a823499b6d",
        //                 "market_id" => "BTC-USDT",
        //                 "type" => "market",
        //                 "side" => "buy",
        //                 "limit_price" => "0",
        //                 "time_in_force" => "ioc",
        //                 "filled_cost" => "7.499992672",
        //                 "filled_quantity" => "0.00032416",
        //                 "open_quantity" => "0",
        //                 "status" => "filled",
        //                 "time" => "2022-07-21T17:09:33.056Z",
        //                 "client_order_id" => '',
        //                 "cost" => "7.5"
        //             ),
        //             ...
        //         ]
        //     }
        //
        $rawOrders = $this->safe_value($message, 'data', array());
        $length = count($rawOrders);
        if ($length === 0) {
            return;
        }
        $messageHash = 'orders';
        $reset = $this->safe_bool($message, 'reset', false);
        $stored = $this->orders;
        if ($stored === null || $reset) {
            $limit = $this->safe_integer($this->options, 'ordersLimit', 1000);
            $stored = new ArrayCacheBySymbolById ($limit);
            $this->orders = $stored;
        }
        $orderSymbols = array();
        for ($i = 0; $i < count($rawOrders); $i++) {
            $rawOrder = $rawOrders[$i];
            $order = $this->parse_order($rawOrder);
            $orderSymbols[$order['symbol']] = true;
            $stored->append ($order);
        }
        $unique = is_array($orderSymbols) ? array_keys($orderSymbols) : array();
        for ($i = 0; $i < count($unique); $i++) {
            $symbol = $unique[$i];
            $symbolSpecificMessageHash = $messageHash . ':' . $symbol;
            $client->resolve ($stored, $symbolSpecificMessageHash);
        }
        $client->resolve ($stored, $messageHash);
    }

    public function watch_order_book(string $symbol, ?int $limit = null, $params = array ()): PromiseInterface {
        return Async\async(function () use ($symbol, $limit, $params) {
            /**
             * watches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
             *
             * @see https://docs-en.probit.com/reference/marketdata
             *
             * @param {string} $symbol unified $symbol of the market to fetch the order book for
             * @param {int} [$limit] the maximum amount of order book entries to return
             * @param {array} [$params] extra parameters specific to the exchange API endpoint
             * @return {array} A dictionary of ~@link https://docs.ccxt.com/#/?id=order-book-structure order book structures~ indexed by market symbols
             */
            $channel = null;
            list($channel, $params) = $this->handle_option_and_params($params, 'watchOrderBook', 'filter', 'order_books');
            $orderbook = Async\await($this->subscribe_public('watchOrderBook', $symbol, 'orderbook', $channel, $params));
            return $orderbook->limit ();
        }) ();
    }

    public function subscribe_private($messageHash, $channel, $params) {
        return Async\async(function () use ($messageHash, $channel, $params) {
            $url = $this->urls['api']['ws'];
            $subscribe = array(
                'type' => 'subscribe',
                'channel' => $channel,
            );
            $request = $this->extend($subscribe, $params);
            $subscribeHash = $messageHash;
            return Async\await($this->watch($url, $messageHash, $request, $subscribeHash));
        }) ();
    }

    public function subscribe_public(string $methodName, string $symbol, $dataType, $filter, $params = array ()) {
        return Async\async(function () use ($methodName, $symbol, $dataType, $filter, $params) {
            Async\await($this->load_markets());
            $market = $this->market($symbol);
            $symbol = $market['symbol'];
            $url = $this->urls['api']['ws'];
            $client = $this->client($url);
            $subscribeHash = 'marketdata:' . $symbol;
            $messageHash = $dataType . ':' . $symbol;
            $filters = array();
            if (is_array($client->subscriptions) && array_key_exists($subscribeHash, $client->subscriptions)) {
                // already subscribed
                $filters = $client->subscriptions[$subscribeHash];
                if (!(is_array($filters) && array_key_exists($filter, $filters))) {
                    // resubscribe
                    unset($client->subscriptions[$subscribeHash]);
                }
            }
            $filters[$filter] = true;
            $keys = is_array($filters) ? array_keys($filters) : array();
            $interval = null;
            list($interval, $params) = $this->handle_option_and_params($params, $methodName, 'interval', 100);
            $request = array(
                'type' => 'subscribe',
                'channel' => 'marketdata',
                'market_id' => $market['id'],
                'filter' => $keys,
                'interval' => $interval,
            );
            $request = $this->extend($request, $params);
            return Async\await($this->watch($url, $messageHash, $request, $subscribeHash, $filters));
        }) ();
    }

    public function handle_order_book(Client $client, $message, $orderBook) {
        //
        //     {
        //         "channel" => "marketdata",
        //         "market_id" => "BTC-USDT",
        //         "status" => "ok",
        //         "lag" => 0,
        //         "order_books" => array(
        //           array( side => "buy", price => '1420.7', quantity => "0.057" ),
        //           ...
        //         ),
        //         "reset" => true
        //     }
        //
        $marketId = $this->safe_string($message, 'market_id');
        $symbol = $this->safe_symbol($marketId);
        $dataBySide = $this->group_by($orderBook, 'side');
        $messageHash = 'orderbook:' . $symbol;
        // $orderbook = $this->safe_value($this->orderbooks, $symbol);
        if (!(is_array($this->orderbooks) && array_key_exists($symbol, $this->orderbooks))) {
            $this->orderbooks[$symbol] = $this->order_book(array());
        }
        $orderbook = $this->orderbooks[$symbol];
        $reset = $this->safe_bool($message, 'reset', false);
        if ($reset) {
            $snapshot = $this->parse_order_book($dataBySide, $symbol, null, 'buy', 'sell', 'price', 'quantity');
            $orderbook->reset ($snapshot);
        } else {
            $this->handle_delta($orderbook, $dataBySide);
        }
        $client->resolve ($orderbook, $messageHash);
    }

    public function handle_bid_asks($bookSide, $bidAsks) {
        for ($i = 0; $i < count($bidAsks); $i++) {
            $bidAsk = $bidAsks[$i];
            $parsed = $this->parse_bid_ask($bidAsk, 'price', 'quantity');
            $bookSide->storeArray ($parsed);
        }
    }

    public function handle_delta($orderbook, $delta) {
        $storedBids = $orderbook['bids'];
        $storedAsks = $orderbook['asks'];
        $asks = $this->safe_value($delta, 'sell', array());
        $bids = $this->safe_value($delta, 'buy', array());
        $this->handle_bid_asks($storedBids, $bids);
        $this->handle_bid_asks($storedAsks, $asks);
    }

    public function handle_error_message(Client $client, $message) {
        //
        //     {
        //         "errorCode" => "INVALID_ARGUMENT",
        //         "message" => '',
        //         "details" => {
        //             "interval" => "invalid"
        //         }
        //     }
        //
        $code = $this->safe_string($message, 'errorCode');
        $errMessage = $this->safe_string($message, 'message', '');
        $details = $this->safe_value($message, 'details');
        $feedback = $this->id . ' ' . $code . ' ' . $errMessage . ' ' . $this->json($details);
        if (is_array($this->exceptions) && array_key_exists('exact', $this->exceptions)) {
            $this->throw_exactly_matched_exception($this->exceptions['exact'], $code, $feedback);
        }
        if (is_array($this->exceptions) && array_key_exists('broad', $this->exceptions)) {
            $this->throw_broadly_matched_exception($this->exceptions['broad'], $errMessage, $feedback);
        }
        throw new ExchangeError($feedback);
    }

    public function handle_authenticate(Client $client, $message) {
        //
        //     array( type => "authorization", $result => "ok" )
        //
        $result = $this->safe_string($message, 'result');
        $future = $client->subscriptions['authenticated'];
        if ($result === 'ok') {
            $messageHash = 'authenticated';
            $client->resolve ($message, $messageHash);
        } else {
            $future->reject ($message);
            unset($client->subscriptions['authenticated']);
        }
    }

    public function handle_market_data(Client $client, $message) {
        $ticker = $this->safe_value($message, 'ticker');
        if ($ticker !== null) {
            $this->handle_ticker($client, $message);
        }
        $trades = $this->safe_value($message, 'recent_trades', array());
        $tradesLength = count($trades);
        if ($tradesLength) {
            $this->handle_trades($client, $message);
        }
        $orderBook = $this->safe_value_n($message, array( 'order_books', 'order_books_l1', 'order_books_l2', 'order_books_l3', 'order_books_l4' ), array());
        $orderBookLength = count($orderBook);
        if ($orderBookLength) {
            $this->handle_order_book($client, $message, $orderBook);
        }
    }

    public function handle_message(Client $client, $message) {
        //
        //     {
        //         "errorCode" => "INVALID_ARGUMENT",
        //         "message" => '',
        //         "details" => {
        //             "interval" => "invalid"
        //         }
        //     }
        //
        // Note about 'reset' field
        // 'reset' => true field - it happens once after initial subscription, which just returns old items by the moment of subscription (like "fetchMyTrades" does)
        //
        $errorCode = $this->safe_string($message, 'errorCode');
        if ($errorCode !== null) {
            $this->handle_error_message($client, $message);
            return;
        }
        $type = $this->safe_string($message, 'type');
        if ($type === 'authorization') {
            $this->handle_authenticate($client, $message);
            return;
        }
        $handlers = array(
            'marketdata' => array($this, 'handle_market_data'),
            'balance' => array($this, 'handle_balance'),
            'trade_history' => array($this, 'handle_my_trades'),
            'open_order' => array($this, 'handle_orders'),
            'order_history' => array($this, 'handle_orders'),
        );
        $channel = $this->safe_string($message, 'channel');
        $handler = $this->safe_value($handlers, $channel);
        if ($handler !== null) {
            $handler($client, $message);
            return;
        }
        $error = new NotSupported ($this->id . ' handleMessage => unknown $message => ' . $this->json($message));
        $client->reject ($error);
    }

    public function authenticate($params = array ()) {
        return Async\async(function () use ($params) {
            $url = $this->urls['api']['ws'];
            $client = $this->client($url);
            $messageHash = 'authenticated';
            $expires = $this->safe_integer($this->options, 'expires', 0);
            $future = $this->safe_value($client->subscriptions, $messageHash);
            if (($future === null) || ($this->milliseconds() > $expires)) {
                $response = Async\await($this->sign_in());
                //
                //     {
                //         "access_token" => "0ttDv/2hTTn3bLi8GP1gKaneiEQ6+0hOBenPrxNQt2s=",
                //         "token_type" => "bearer",
                //         "expires_in" => 900
                //     }
                //
                $accessToken = $this->safe_string($response, 'access_token');
                $request = array(
                    'type' => 'authorization',
                    'token' => $accessToken,
                );
                $future = Async\await($this->watch($url, $messageHash, $this->extend($request, $params), $messageHash));
                $client->subscriptions[$messageHash] = $future;
            }
            return $future;
        }) ();
    }
}
