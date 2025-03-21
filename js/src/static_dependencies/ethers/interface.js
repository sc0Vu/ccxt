/**
 *  The Interface class is a low-level class that accepts an
 *  ABI and provides all the necessary functionality to encode
 *  and decode paramaters to and results from methods, events
 *  and errors.
 *
 *  It also provides several convenience methods to automatically
 *  search and find matching transactions and events to parse them.
 *
 *  @_subsection api/abi:Interfaces  [interfaces]
 */
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Interface_instances, _Interface_errors, _Interface_events, _Interface_functions, _Interface_abiCoder, _Interface_getFunction, _Interface_getEvent;
import { id, keccak256 } from "./utils/index.js";
import { concat, dataSlice, getBigInt, getBytes, getBytesCopy, hexlify, zeroPadBytes, zeroPadValue, isHexString, defineProperties, assertArgument, toBeHex, assert } from "./utils/index.js";
import { AbiCoder } from "./abi-coder.js";
import { checkResultErrors, Result } from "./coders/abstract-coder.js";
import { ConstructorFragment, ErrorFragment, EventFragment, Fragment, FunctionFragment, ParamType } from "./fragments.js";
import { Typed } from "./typed.js";
export { checkResultErrors, Result };
/**
 *  When using the [[Interface-parseLog]] to automatically match a Log to its event
 *  for parsing, a **LogDescription** is returned.
 */
export class LogDescription {
    /**
     *  @_ignore:
     */
    constructor(fragment, topic, args) {
        const name = fragment.name, signature = fragment.format();
        defineProperties(this, {
            fragment, name, signature, topic, args
        });
    }
}
/**
 *  When using the [[Interface-parseTransaction]] to automatically match
 *  a transaction data to its function for parsing,
 *  a **TransactionDescription** is returned.
 */
export class TransactionDescription {
    /**
     *  @_ignore:
     */
    constructor(fragment, selector, args, value) {
        const name = fragment.name, signature = fragment.format();
        defineProperties(this, {
            fragment, name, args, signature, selector, value
        });
    }
}
/**
 *  When using the [[Interface-parseError]] to automatically match an
 *  error for a call result for parsing, an **ErrorDescription** is returned.
 */
export class ErrorDescription {
    /**
     *  @_ignore:
     */
    constructor(fragment, selector, args) {
        const name = fragment.name, signature = fragment.format();
        defineProperties(this, {
            fragment, name, args, signature, selector
        });
    }
}
/**
 *  An **Indexed** is used as a value when a value that does not
 *  fit within a topic (i.e. not a fixed-length, 32-byte type). It
 *  is the ``keccak256`` of the value, and used for types such as
 *  arrays, tuples, bytes and strings.
 */
export class Indexed {
    /**
     *  @_ignore:
     */
    constructor(hash) {
        defineProperties(this, { hash, _isIndexed: true });
    }
    /**
     *  Returns ``true`` if %%value%% is an **Indexed**.
     *
     *  This provides a Type Guard for property access.
     */
    static isIndexed(value) {
        return !!(value && value._isIndexed);
    }
}
// https://docs.soliditylang.org/en/v0.8.13/control-structures.html?highlight=panic#panic-via-assert-and-error-via-require
const PanicReasons = {
    "0": "generic panic",
    "1": "assert(false)",
    "17": "arithmetic overflow",
    "18": "division or modulo by zero",
    "33": "enum overflow",
    "34": "invalid encoded storage byte array accessed",
    "49": "out-of-bounds array access; popping on an empty array",
    "50": "out-of-bounds access of an array or bytesN",
    "65": "out of memory",
    "81": "uninitialized function",
};
const BuiltinErrors = {
    "0x08c379a0": {
        signature: "Error(string)",
        name: "Error",
        inputs: ["string"],
        reason: (message) => {
            return `reverted with reason string ${JSON.stringify(message)}`;
        }
    },
    "0x4e487b71": {
        signature: "Panic(uint256)",
        name: "Panic",
        inputs: ["uint256"],
        reason: (code) => {
            let reason = "unknown panic code";
            if (code >= 0 && code <= 0xff && PanicReasons[code.toString()]) {
                reason = PanicReasons[code.toString()];
            }
            return `reverted with panic code 0x${code.toString(16)} (${reason})`;
        }
    }
};
/**
 *  An Interface abstracts many of the low-level details for
 *  encoding and decoding the data on the blockchain.
 *
 *  An ABI provides information on how to encode data to send to
 *  a Contract, how to decode the results and events and how to
 *  interpret revert errors.
 *
 *  The ABI can be specified by [any supported format](InterfaceAbi).
 */
export class Interface {
    /**
     *  Create a new Interface for the %%fragments%%.
     */
    constructor(fragments) {
        _Interface_instances.add(this);
        _Interface_errors.set(this, void 0);
        _Interface_events.set(this, void 0);
        _Interface_functions.set(this, void 0);
        //    #structs: Map<string, StructFragment>;
        _Interface_abiCoder.set(this, void 0);
        let abi = [];
        if (typeof (fragments) === "string") {
            abi = JSON.parse(fragments);
        }
        else {
            abi = fragments;
        }
        __classPrivateFieldSet(this, _Interface_functions, new Map(), "f");
        __classPrivateFieldSet(this, _Interface_errors, new Map(), "f");
        __classPrivateFieldSet(this, _Interface_events, new Map(), "f");
        //        this.#structs = new Map();
        const frags = [];
        for (const a of abi) {
            try {
                frags.push(Fragment.from(a));
            }
            catch (error) {
                console.log("EE", error);
            }
        }
        defineProperties(this, {
            fragments: Object.freeze(frags)
        });
        let fallback = null;
        let receive = false;
        __classPrivateFieldSet(this, _Interface_abiCoder, this.getAbiCoder(), "f");
        // Add all fragments by their signature
        this.fragments.forEach((fragment, index) => {
            let bucket;
            switch (fragment.type) {
                case "constructor":
                    if (this.deploy) {
                        console.log("duplicate definition - constructor");
                        return;
                    }
                    //checkNames(fragment, "input", fragment.inputs);
                    defineProperties(this, { deploy: fragment });
                    return;
                case "fallback":
                    if (fragment.inputs.length === 0) {
                        receive = true;
                    }
                    else {
                        assertArgument(!fallback || fragment.payable !== fallback.payable, "conflicting fallback fragments", `fragments[${index}]`, fragment);
                        fallback = fragment;
                        receive = fallback.payable;
                    }
                    return;
                case "function":
                    //checkNames(fragment, "input", fragment.inputs);
                    //checkNames(fragment, "output", (<FunctionFragment>fragment).outputs);
                    bucket = __classPrivateFieldGet(this, _Interface_functions, "f");
                    break;
                case "event":
                    //checkNames(fragment, "input", fragment.inputs);
                    bucket = __classPrivateFieldGet(this, _Interface_events, "f");
                    break;
                case "error":
                    bucket = __classPrivateFieldGet(this, _Interface_errors, "f");
                    break;
                default:
                    return;
            }
            // Two identical entries; ignore it
            const signature = fragment.format();
            if (bucket.has(signature)) {
                return;
            }
            bucket.set(signature, fragment);
        });
        // If we do not have a constructor add a default
        if (!this.deploy) {
            defineProperties(this, {
                deploy: ConstructorFragment.from("constructor()")
            });
        }
        defineProperties(this, { fallback, receive });
    }
    /**
     *  Returns the entire Human-Readable ABI, as an array of
     *  signatures, optionally as %%minimal%% strings, which
     *  removes parameter names and unneceesary spaces.
     */
    format(minimal) {
        const format = (minimal ? "minimal" : "full");
        const abi = this.fragments.map((f) => f.format(format));
        return abi;
    }
    /**
     *  Return the JSON-encoded ABI. This is the format Solidiy
     *  returns.
     */
    formatJson() {
        const abi = this.fragments.map((f) => f.format("json"));
        // We need to re-bundle the JSON fragments a bit
        return JSON.stringify(abi.map((j) => JSON.parse(j)));
    }
    /**
     *  The ABI coder that will be used to encode and decode binary
     *  data.
     */
    getAbiCoder() {
        return AbiCoder.defaultAbiCoder();
    }
    /**
     *  Get the function name for %%key%%, which may be a function selector,
     *  function name or function signature that belongs to the ABI.
     */
    getFunctionName(key) {
        const fragment = __classPrivateFieldGet(this, _Interface_instances, "m", _Interface_getFunction).call(this, key, null, false);
        assertArgument(fragment, "no matching function", "key", key);
        return fragment.name;
    }
    /**
     *  Returns true if %%key%% (a function selector, function name or
     *  function signature) is present in the ABI.
     *
     *  In the case of a function name, the name may be ambiguous, so
     *  accessing the [[FunctionFragment]] may require refinement.
     */
    hasFunction(key) {
        return !!__classPrivateFieldGet(this, _Interface_instances, "m", _Interface_getFunction).call(this, key, null, false);
    }
    /**
     *  Get the [[FunctionFragment]] for %%key%%, which may be a function
     *  selector, function name or function signature that belongs to the ABI.
     *
     *  If %%values%% is provided, it will use the Typed API to handle
     *  ambiguous cases where multiple functions match by name.
     *
     *  If the %%key%% and %%values%% do not refine to a single function in
     *  the ABI, this will throw.
     */
    getFunction(key, values) {
        return __classPrivateFieldGet(this, _Interface_instances, "m", _Interface_getFunction).call(this, key, values || null, true);
    }
    /**
     *  Iterate over all functions, calling %%callback%%, sorted by their name.
     */
    forEachFunction(callback) {
        const names = Array.from(__classPrivateFieldGet(this, _Interface_functions, "f").keys());
        names.sort((a, b) => a.localeCompare(b));
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            callback((__classPrivateFieldGet(this, _Interface_functions, "f").get(name)), i);
        }
    }
    /**
     *  Get the event name for %%key%%, which may be a topic hash,
     *  event name or event signature that belongs to the ABI.
     */
    getEventName(key) {
        const fragment = __classPrivateFieldGet(this, _Interface_instances, "m", _Interface_getEvent).call(this, key, null, false);
        assertArgument(fragment, "no matching event", "key", key);
        return fragment.name;
    }
    /**
     *  Returns true if %%key%% (an event topic hash, event name or
     *  event signature) is present in the ABI.
     *
     *  In the case of an event name, the name may be ambiguous, so
     *  accessing the [[EventFragment]] may require refinement.
     */
    hasEvent(key) {
        return !!__classPrivateFieldGet(this, _Interface_instances, "m", _Interface_getEvent).call(this, key, null, false);
    }
    /**
     *  Get the [[EventFragment]] for %%key%%, which may be a topic hash,
     *  event name or event signature that belongs to the ABI.
     *
     *  If %%values%% is provided, it will use the Typed API to handle
     *  ambiguous cases where multiple events match by name.
     *
     *  If the %%key%% and %%values%% do not refine to a single event in
     *  the ABI, this will throw.
     */
    getEvent(key, values) {
        return __classPrivateFieldGet(this, _Interface_instances, "m", _Interface_getEvent).call(this, key, values || null, true);
    }
    /**
     *  Iterate over all events, calling %%callback%%, sorted by their name.
     */
    forEachEvent(callback) {
        const names = Array.from(__classPrivateFieldGet(this, _Interface_events, "f").keys());
        names.sort((a, b) => a.localeCompare(b));
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            callback((__classPrivateFieldGet(this, _Interface_events, "f").get(name)), i);
        }
    }
    /**
     *  Get the [[ErrorFragment]] for %%key%%, which may be an error
     *  selector, error name or error signature that belongs to the ABI.
     *
     *  If %%values%% is provided, it will use the Typed API to handle
     *  ambiguous cases where multiple errors match by name.
     *
     *  If the %%key%% and %%values%% do not refine to a single error in
     *  the ABI, this will throw.
     */
    getError(key, values) {
        if (isHexString(key)) {
            const selector = key.toLowerCase();
            if (BuiltinErrors[selector]) {
                return ErrorFragment.from(BuiltinErrors[selector].signature);
            }
            for (const fragment of __classPrivateFieldGet(this, _Interface_errors, "f").values()) {
                if (selector === fragment.selector) {
                    return fragment;
                }
            }
            return null;
        }
        // It is a bare name, look up the function (will return null if ambiguous)
        if (key.indexOf("(") === -1) {
            const matching = [];
            for (const [name, fragment] of __classPrivateFieldGet(this, _Interface_errors, "f")) {
                if (name.split("(" /* fix:) */)[0] === key) {
                    matching.push(fragment);
                }
            }
            if (matching.length === 0) {
                if (key === "Error") {
                    return ErrorFragment.from("error Error(string)");
                }
                if (key === "Panic") {
                    return ErrorFragment.from("error Panic(uint256)");
                }
                return null;
            }
            else if (matching.length > 1) {
                const matchStr = matching.map((m) => JSON.stringify(m.format())).join(", ");
                assertArgument(false, `ambiguous error description (i.e. ${matchStr})`, "name", key);
            }
            return matching[0];
        }
        // Normalize the signature and lookup the function
        key = ErrorFragment.from(key).format();
        if (key === "Error(string)") {
            return ErrorFragment.from("error Error(string)");
        }
        if (key === "Panic(uint256)") {
            return ErrorFragment.from("error Panic(uint256)");
        }
        const result = __classPrivateFieldGet(this, _Interface_errors, "f").get(key);
        if (result) {
            return result;
        }
        return null;
    }
    /**
     *  Iterate over all errors, calling %%callback%%, sorted by their name.
     */
    forEachError(callback) {
        const names = Array.from(__classPrivateFieldGet(this, _Interface_errors, "f").keys());
        names.sort((a, b) => a.localeCompare(b));
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            callback((__classPrivateFieldGet(this, _Interface_errors, "f").get(name)), i);
        }
    }
    // Get the 4-byte selector used by Solidity to identify a function
    /*
getSelector(fragment: ErrorFragment | FunctionFragment): string {
    if (typeof(fragment) === "string") {
        const matches: Array<Fragment> = [ ];

        try { matches.push(this.getFunction(fragment)); } catch (error) { }
        try { matches.push(this.getError(<string>fragment)); } catch (_) { }

        if (matches.length === 0) {
            logger.throwArgumentError("unknown fragment", "key", fragment);
        } else if (matches.length > 1) {
            logger.throwArgumentError("ambiguous fragment matches function and error", "key", fragment);
        }

        fragment = matches[0];
    }

    return dataSlice(id(fragment.format()), 0, 4);
}
    */
    // Get the 32-byte topic hash used by Solidity to identify an event
    /*
    getEventTopic(fragment: EventFragment): string {
        //if (typeof(fragment) === "string") { fragment = this.getEvent(eventFragment); }
        return id(fragment.format());
    }
    */
    _decodeParams(params, data) {
        return __classPrivateFieldGet(this, _Interface_abiCoder, "f").decode(params, data);
    }
    _encodeParams(params, values) {
        return __classPrivateFieldGet(this, _Interface_abiCoder, "f").encode(params, values);
    }
    /**
     *  Encodes a ``tx.data`` object for deploying the Contract with
     *  the %%values%% as the constructor arguments.
     */
    encodeDeploy(values) {
        return this._encodeParams(this.deploy.inputs, values || []);
    }
    /**
     *  Decodes the result %%data%% (e.g. from an ``eth_call``) for the
     *  specified error (see [[getError]] for valid values for
     *  %%key%%).
     *
     *  Most developers should prefer the [[parseCallResult]] method instead,
     *  which will automatically detect a ``CALL_EXCEPTION`` and throw the
     *  corresponding error.
     */
    decodeErrorResult(fragment, data) {
        if (typeof (fragment) === "string") {
            const f = this.getError(fragment);
            assertArgument(f, "unknown error", "fragment", fragment);
            fragment = f;
        }
        assertArgument(dataSlice(data, 0, 4) === fragment.selector, `data signature does not match error ${fragment.name}.`, "data", data);
        return this._decodeParams(fragment.inputs, dataSlice(data, 4));
    }
    /**
     *  Encodes the transaction revert data for a call result that
     *  reverted from the the Contract with the sepcified %%error%%
     *  (see [[getError]] for valid values for %%fragment%%) with the %%values%%.
     *
     *  This is generally not used by most developers, unless trying to mock
     *  a result from a Contract.
     */
    encodeErrorResult(fragment, values) {
        if (typeof (fragment) === "string") {
            const f = this.getError(fragment);
            assertArgument(f, "unknown error", "fragment", fragment);
            fragment = f;
        }
        return concat([
            fragment.selector,
            this._encodeParams(fragment.inputs, values || [])
        ]);
    }
    /**
     *  Decodes the %%data%% from a transaction ``tx.data`` for
     *  the function specified (see [[getFunction]] for valid values
     *  for %%fragment%%).
     *
     *  Most developers should prefer the [[parseTransaction]] method
     *  instead, which will automatically detect the fragment.
     */
    decodeFunctionData(fragment, data) {
        if (typeof (fragment) === "string") {
            const f = this.getFunction(fragment);
            assertArgument(f, "unknown function", "fragment", fragment);
            fragment = f;
        }
        assertArgument(dataSlice(data, 0, 4) === fragment.selector, `data signature does not match function ${fragment.name}.`, "data", data);
        return this._decodeParams(fragment.inputs, dataSlice(data, 4));
    }
    /**
     *  Encodes the ``tx.data`` for a transaction that calls the function
     *  specified (see [[getFunction]] for valid values for %%fragment%%) with
     *  the %%values%%.
     */
    encodeFunctionData(fragment, values) {
        if (typeof (fragment) === "string") {
            const f = this.getFunction(fragment);
            assertArgument(f, "unknown function", "fragment", fragment);
            fragment = f;
        }
        return concat([
            fragment.selector,
            this._encodeParams(fragment.inputs, values || [])
        ]);
    }
    /**
     *  Decodes the result %%data%% (e.g. from an ``eth_call``) for the
     *  specified function (see [[getFunction]] for valid values for
     *  %%key%%).
     *
     *  Most developers should prefer the [[parseCallResult]] method instead,
     *  which will automatically detect a ``CALL_EXCEPTION`` and throw the
     *  corresponding error.
     */
    decodeFunctionResult(fragment, data) {
        if (typeof (fragment) === "string") {
            const f = this.getFunction(fragment);
            assertArgument(f, "unknown function", "fragment", fragment);
            fragment = f;
        }
        let message = "invalid length for result data";
        const bytes = getBytesCopy(data);
        if ((bytes.length % 32) === 0) {
            try {
                return __classPrivateFieldGet(this, _Interface_abiCoder, "f").decode(fragment.outputs, bytes);
            }
            catch (error) {
                message = "could not decode result data";
            }
        }
        // Call returned data with no error, but the data is junk
        assert(false, message, "BAD_DATA", {
            value: hexlify(bytes),
            info: { method: fragment.name, signature: fragment.format() }
        });
    }
    /**
     *  Encodes the result data (e.g. from an ``eth_call``) for the
     *  specified function (see [[getFunction]] for valid values
     *  for %%fragment%%) with %%values%%.
     *
     *  This is generally not used by most developers, unless trying to mock
     *  a result from a Contract.
     */
    encodeFunctionResult(fragment, values) {
        if (typeof (fragment) === "string") {
            const f = this.getFunction(fragment);
            assertArgument(f, "unknown function", "fragment", fragment);
            fragment = f;
        }
        return hexlify(__classPrivateFieldGet(this, _Interface_abiCoder, "f").encode(fragment.outputs, values || []));
    }
    /*
        spelunk(inputs: Array<ParamType>, values: ReadonlyArray<any>, processfunc: (type: string, value: any) => Promise<any>): Promise<Array<any>> {
            const promises: Array<Promise<>> = [ ];
            const process = function(type: ParamType, value: any): any {
                if (type.baseType === "array") {
                    return descend(type.child
                }
                if (type. === "address") {
                }
            };
    
            const descend = function (inputs: Array<ParamType>, values: ReadonlyArray<any>) {
                if (inputs.length !== values.length) { throw new Error("length mismatch"); }
                
            };
    
            const result: Array<any> = [ ];
            values.forEach((value, index) => {
                if (value == null) {
                    topics.push(null);
                } else if (param.baseType === "array" || param.baseType === "tuple") {
                    logger.throwArgumentError("filtering with tuples or arrays not supported", ("contract." + param.name), value);
                } else if (Array.isArray(value)) {
                    topics.push(value.map((value) => encodeTopic(param, value)));
                } else {
                    topics.push(encodeTopic(param, value));
                }
            });
        }
    */
    // Create the filter for the event with search criteria (e.g. for eth_filterLog)
    encodeFilterTopics(fragment, values) {
        if (typeof (fragment) === "string") {
            const f = this.getEvent(fragment);
            assertArgument(f, "unknown event", "eventFragment", fragment);
            fragment = f;
        }
        assert(values.length <= fragment.inputs.length, `too many arguments for ${fragment.format()}`, "UNEXPECTED_ARGUMENT", { count: values.length, expectedCount: fragment.inputs.length });
        const topics = [];
        if (!fragment.anonymous) {
            topics.push(fragment.topicHash);
        }
        // @TODO: Use the coders for this; to properly support tuples, etc.
        const encodeTopic = (param, value) => {
            if (param.type === "string") {
                return id(value);
            }
            else if (param.type === "bytes") {
                return keccak256(value);
            }
            if (param.type === "bool" && typeof (value) === "boolean") {
                value = (value ? "0x01" : "0x00");
            }
            else if (param.type.match(/^u?int/)) {
                value = toBeHex(value); // @TODO: Should this toTwos??
            }
            else if (param.type.match(/^bytes/)) {
                value = zeroPadBytes(value, 32);
            }
            else if (param.type === "address") {
                // Check addresses are valid
                __classPrivateFieldGet(this, _Interface_abiCoder, "f").encode(["address"], [value]);
            }
            return zeroPadValue(hexlify(value), 32);
        };
        values.forEach((value, index) => {
            const param = fragment.inputs[index];
            if (!param.indexed) {
                assertArgument(value == null, "cannot filter non-indexed parameters; must be null", ("contract." + param.name), value);
                return;
            }
            if (value == null) {
                topics.push(null);
            }
            else if (param.baseType === "array" || param.baseType === "tuple") {
                assertArgument(false, "filtering with tuples or arrays not supported", ("contract." + param.name), value);
            }
            else if (Array.isArray(value)) {
                topics.push(value.map((value) => encodeTopic(param, value)));
            }
            else {
                topics.push(encodeTopic(param, value));
            }
        });
        // Trim off trailing nulls
        while (topics.length && topics[topics.length - 1] === null) {
            topics.pop();
        }
        return topics;
    }
    encodeEventLog(fragment, values) {
        if (typeof (fragment) === "string") {
            const f = this.getEvent(fragment);
            assertArgument(f, "unknown event", "eventFragment", fragment);
            fragment = f;
        }
        const topics = [];
        const dataTypes = [];
        const dataValues = [];
        if (!fragment.anonymous) {
            topics.push(fragment.topicHash);
        }
        assertArgument(values.length === fragment.inputs.length, "event arguments/values mismatch", "values", values);
        fragment.inputs.forEach((param, index) => {
            const value = values[index];
            if (param.indexed) {
                if (param.type === "string") {
                    topics.push(id(value));
                }
                else if (param.type === "bytes") {
                    topics.push(keccak256(value));
                }
                else if (param.baseType === "tuple" || param.baseType === "array") {
                    // @TODO
                    throw new Error("not implemented");
                }
                else {
                    topics.push(__classPrivateFieldGet(this, _Interface_abiCoder, "f").encode([param.type], [value]));
                }
            }
            else {
                dataTypes.push(param);
                dataValues.push(value);
            }
        });
        return {
            data: __classPrivateFieldGet(this, _Interface_abiCoder, "f").encode(dataTypes, dataValues),
            topics: topics
        };
    }
    // Decode a filter for the event and the search criteria
    decodeEventLog(fragment, data, topics) {
        if (typeof (fragment) === "string") {
            const f = this.getEvent(fragment);
            assertArgument(f, "unknown event", "eventFragment", fragment);
            fragment = f;
        }
        if (topics != null && !fragment.anonymous) {
            const eventTopic = fragment.topicHash;
            assertArgument(isHexString(topics[0], 32) && topics[0].toLowerCase() === eventTopic, "fragment/topic mismatch", "topics[0]", topics[0]);
            topics = topics.slice(1);
        }
        const indexed = [];
        const nonIndexed = [];
        const dynamic = [];
        fragment.inputs.forEach((param, index) => {
            if (param.indexed) {
                if (param.type === "string" || param.type === "bytes" || param.baseType === "tuple" || param.baseType === "array") {
                    indexed.push(ParamType.from({ type: "bytes32", name: param.name }));
                    dynamic.push(true);
                }
                else {
                    indexed.push(param);
                    dynamic.push(false);
                }
            }
            else {
                nonIndexed.push(param);
                dynamic.push(false);
            }
        });
        const resultIndexed = (topics != null) ? __classPrivateFieldGet(this, _Interface_abiCoder, "f").decode(indexed, concat(topics)) : null;
        const resultNonIndexed = __classPrivateFieldGet(this, _Interface_abiCoder, "f").decode(nonIndexed, data, true);
        //const result: (Array<any> & { [ key: string ]: any }) = [ ];
        const values = [];
        const keys = [];
        let nonIndexedIndex = 0, indexedIndex = 0;
        fragment.inputs.forEach((param, index) => {
            let value = null;
            if (param.indexed) {
                if (resultIndexed == null) {
                    value = new Indexed(null);
                }
                else if (dynamic[index]) {
                    value = new Indexed(resultIndexed[indexedIndex++]);
                }
                else {
                    try {
                        value = resultIndexed[indexedIndex++];
                    }
                    catch (error) {
                        value = error;
                    }
                }
            }
            else {
                try {
                    value = resultNonIndexed[nonIndexedIndex++];
                }
                catch (error) {
                    value = error;
                }
            }
            values.push(value);
            keys.push(param.name || null);
        });
        return Result.fromItems(values, keys);
    }
    /**
     *  Parses a transaction, finding the matching function and extracts
     *  the parameter values along with other useful function details.
     *
     *  If the matching function cannot be found, return null.
     */
    parseTransaction(tx) {
        const data = getBytes(tx.data, "tx.data");
        const value = getBigInt((tx.value != null) ? tx.value : 0, "tx.value");
        const fragment = this.getFunction(hexlify(data.slice(0, 4)));
        if (!fragment) {
            return null;
        }
        const args = __classPrivateFieldGet(this, _Interface_abiCoder, "f").decode(fragment.inputs, data.slice(4));
        return new TransactionDescription(fragment, fragment.selector, args, value);
    }
    parseCallResult(data) {
        throw new Error("@TODO");
    }
    /**
     *  Parses a receipt log, finding the matching event and extracts
     *  the parameter values along with other useful event details.
     *
     *  If the matching event cannot be found, returns null.
     */
    parseLog(log) {
        const fragment = this.getEvent(log.topics[0]);
        if (!fragment || fragment.anonymous) {
            return null;
        }
        // @TODO: If anonymous, and the only method, and the input count matches, should we parse?
        //        Probably not, because just because it is the only event in the ABI does
        //        not mean we have the full ABI; maybe just a fragment?
        return new LogDescription(fragment, fragment.topicHash, this.decodeEventLog(fragment, log.data, log.topics));
    }
    /**
     *  Parses a revert data, finding the matching error and extracts
     *  the parameter values along with other useful error details.
     *
     *  If the matching error cannot be found, returns null.
     */
    parseError(data) {
        const hexData = hexlify(data);
        const fragment = this.getError(dataSlice(hexData, 0, 4));
        if (!fragment) {
            return null;
        }
        const args = __classPrivateFieldGet(this, _Interface_abiCoder, "f").decode(fragment.inputs, dataSlice(hexData, 4));
        return new ErrorDescription(fragment, fragment.selector, args);
    }
    /**
     *  Creates a new [[Interface]] from the ABI %%value%%.
     *
     *  The %%value%% may be provided as an existing [[Interface]] object,
     *  a JSON-encoded ABI or any Human-Readable ABI format.
     */
    static from(value) {
        // Already an Interface, which is immutable
        if (value instanceof Interface) {
            return value;
        }
        // JSON
        if (typeof (value) === "string") {
            return new Interface(JSON.parse(value));
        }
        // Maybe an interface from an older version, or from a symlinked copy
        if (typeof (value.format) === "function") {
            return new Interface(value.format("json"));
        }
        // Array of fragments
        return new Interface(value);
    }
}
_Interface_errors = new WeakMap(), _Interface_events = new WeakMap(), _Interface_functions = new WeakMap(), _Interface_abiCoder = new WeakMap(), _Interface_instances = new WeakSet(), _Interface_getFunction = function _Interface_getFunction(key, values, forceUnique) {
    // Selector
    if (isHexString(key)) {
        const selector = key.toLowerCase();
        for (const fragment of __classPrivateFieldGet(this, _Interface_functions, "f").values()) {
            if (selector === fragment.selector) {
                return fragment;
            }
        }
        return null;
    }
    // It is a bare name, look up the function (will return null if ambiguous)
    if (key.indexOf("(") === -1) {
        const matching = [];
        for (const [name, fragment] of __classPrivateFieldGet(this, _Interface_functions, "f")) {
            if (name.split("(" /* fix:) */)[0] === key) {
                matching.push(fragment);
            }
        }
        if (values) {
            const lastValue = (values.length > 0) ? values[values.length - 1] : null;
            let valueLength = values.length;
            let allowOptions = true;
            if (Typed.isTyped(lastValue) && lastValue.type === "overrides") {
                allowOptions = false;
                valueLength--;
            }
            // Remove all matches that don't have a compatible length. The args
            // may contain an overrides, so the match may have n or n - 1 parameters
            for (let i = matching.length - 1; i >= 0; i--) {
                const inputs = matching[i].inputs.length;
                if (inputs !== valueLength && (!allowOptions || inputs !== valueLength - 1)) {
                    matching.splice(i, 1);
                }
            }
            // Remove all matches that don't match the Typed signature
            for (let i = matching.length - 1; i >= 0; i--) {
                const inputs = matching[i].inputs;
                for (let j = 0; j < values.length; j++) {
                    // Not a typed value
                    if (!Typed.isTyped(values[j])) {
                        continue;
                    }
                    // We are past the inputs
                    if (j >= inputs.length) {
                        if (values[j].type === "overrides") {
                            continue;
                        }
                        matching.splice(i, 1);
                        break;
                    }
                    // Make sure the value type matches the input type
                    if (values[j].type !== inputs[j].baseType) {
                        matching.splice(i, 1);
                        break;
                    }
                }
            }
        }
        // We found a single matching signature with an overrides, but the
        // last value is something that cannot possibly be an options
        if (matching.length === 1 && values && values.length !== matching[0].inputs.length) {
            const lastArg = values[values.length - 1];
            if (lastArg == null || Array.isArray(lastArg) || typeof (lastArg) !== "object") {
                matching.splice(0, 1);
            }
        }
        if (matching.length === 0) {
            return null;
        }
        if (matching.length > 1 && forceUnique) {
            const matchStr = matching.map((m) => JSON.stringify(m.format())).join(", ");
            assertArgument(false, `ambiguous function description (i.e. matches ${matchStr})`, "key", key);
        }
        return matching[0];
    }
    // Normalize the signature and lookup the function
    const result = __classPrivateFieldGet(this, _Interface_functions, "f").get(FunctionFragment.from(key).format());
    if (result) {
        return result;
    }
    return null;
}, _Interface_getEvent = function _Interface_getEvent(key, values, forceUnique) {
    // EventTopic
    if (isHexString(key)) {
        const eventTopic = key.toLowerCase();
        for (const fragment of __classPrivateFieldGet(this, _Interface_events, "f").values()) {
            if (eventTopic === fragment.topicHash) {
                return fragment;
            }
        }
        return null;
    }
    // It is a bare name, look up the function (will return null if ambiguous)
    if (key.indexOf("(") === -1) {
        const matching = [];
        for (const [name, fragment] of __classPrivateFieldGet(this, _Interface_events, "f")) {
            if (name.split("(" /* fix:) */)[0] === key) {
                matching.push(fragment);
            }
        }
        if (values) {
            // Remove all matches that don't have a compatible length.
            for (let i = matching.length - 1; i >= 0; i--) {
                if (matching[i].inputs.length < values.length) {
                    matching.splice(i, 1);
                }
            }
            // Remove all matches that don't match the Typed signature
            for (let i = matching.length - 1; i >= 0; i--) {
                const inputs = matching[i].inputs;
                for (let j = 0; j < values.length; j++) {
                    // Not a typed value
                    if (!Typed.isTyped(values[j])) {
                        continue;
                    }
                    // Make sure the value type matches the input type
                    if (values[j].type !== inputs[j].baseType) {
                        matching.splice(i, 1);
                        break;
                    }
                }
            }
        }
        if (matching.length === 0) {
            return null;
        }
        if (matching.length > 1 && forceUnique) {
            const matchStr = matching.map((m) => JSON.stringify(m.format())).join(", ");
            assertArgument(false, `ambiguous event description (i.e. matches ${matchStr})`, "key", key);
        }
        return matching[0];
    }
    // Normalize the signature and lookup the function
    const result = __classPrivateFieldGet(this, _Interface_events, "f").get(EventFragment.from(key).format());
    if (result) {
        return result;
    }
    return null;
};
