import { Literal, Uint, } from '../../types/index.js';
import { CairoFelt } from '../cairoDataTypes/felt.js';
import { CairoUint256 } from '../cairoDataTypes/uint256.js';
import { CairoUint512 } from '../cairoDataTypes/uint512.js';
// Intended for internal usage, maybe should be exported somewhere else and not exported to utils
/**
 * Checks if the given name ends with "_len".
 *
 * @param {string} name - The name to be checked.
 * @returns - True if the name ends with "_len", false otherwise.
 */
export const isLen = (name) => /_len$/.test(name);
/**
 * Checks if a given type is felt.
 *
 * @param {string} type - The type to check.
 * @returns - True if the type is felt, false otherwise.
 */
export const isTypeFelt = (type) => type === 'felt' || type === 'core::felt252';
/**
 * Checks if the given type is an array type.
 *
 * @param {string} type - The type to check.
 * @returns - `true` if the type is an array type, `false` otherwise.
 */
export const isTypeArray = (type) => /\*/.test(type) ||
    type.startsWith('core::array::Array::') ||
    type.startsWith('core::array::Span::');
/**
 * Checks if the given type is a tuple type.
 *
 * @param {string} type - The type to be checked.
 * @returns - `true` if the type is a tuple type, otherwise `false`.
 */
export const isTypeTuple = (type) => /^\(.*\)$/i.test(type);
/**
 * Checks whether a given type is a named tuple.
 *
 * @param {string} type - The type to be checked.
 * @returns - True if the type is a named tuple, false otherwise.
 */
export const isTypeNamedTuple = (type) => /\(.*\)/i.test(type) && type.includes(':');
/**
 * Checks if a given type is a struct.
 *
 * @param {string} type - The type to check for existence.
 * @param {AbiStructs} structs - The collection of structs to search in.
 * @returns - True if the type exists in the structs, false otherwise.
 */
export const isTypeStruct = (type, structs) => type in structs;
/**
 * Checks if a given type is an enum.
 *
 * @param {string} type - The type to check.
 * @param {AbiEnums} enums - The enumeration to search in.
 * @returns - True if the type exists in the enumeration, otherwise false.
 */
export const isTypeEnum = (type, enums) => type in enums;
/**
 * Determines if the given type is an Option type.
 *
 * @param {string} type - The type to check.
 * @returns - True if the type is an Option type, false otherwise.
 */
export const isTypeOption = (type) => type.startsWith('core::option::Option::');
/**
 * Checks whether a given type starts with 'core::result::Result::'.
 *
 * @param {string} type - The type to check.
 * @returns - True if the type starts with 'core::result::Result::', false otherwise.
 */
export const isTypeResult = (type) => type.startsWith('core::result::Result::');
/**
 * Checks if the given value is a valid Uint type.
 *
 * @param {string} type - The value to check.
 * @returns - Returns true if the value is a valid Uint type, otherwise false.
 */
export const isTypeUint = (type) => Object.values(Uint).includes(type);
// Legacy Export
/**
 * Checks if the given type is `uint256`.
 *
 * @param {string} type - The type to be checked.
 * @returns - Returns true if the type is `uint256`, otherwise false.
 */
export const isTypeUint256 = (type) => CairoUint256.isAbiType(type);
/**
 * Checks if the given type is a literal type.
 *
 * @param {string} type - The type to check.
 * @returns - True if the type is a literal type, false otherwise.
 */
export const isTypeLiteral = (type) => Object.values(Literal).includes(type);
/**
 * Checks if the given type is a boolean type.
 *
 * @param {string} type - The type to be checked.
 * @returns - Returns true if the type is a boolean type, otherwise false.
 */
export const isTypeBool = (type) => type === 'core::bool';
/**
 * Checks if the provided type is equal to 'core::starknet::contract_address::ContractAddress'.
 * @param {string} type - The type to be checked.
 * @returns - true if the type matches 'core::starknet::contract_address::ContractAddress', false otherwise.
 */
export const isTypeContractAddress = (type) => type === 'core::starknet::contract_address::ContractAddress';
/**
 * Determines if the given type is an Ethereum address type.
 *
 * @param {string} type - The type to check.
 * @returns - Returns true if the given type is 'core::starknet::eth_address::EthAddress', otherwise false.
 */
export const isTypeEthAddress = (type) => type === 'core::starknet::eth_address::EthAddress';
/**
 * Checks if the given type is 'core::bytes_31::bytes31'.
 *
 * @param {string} type - The type to check.
 * @returns - True if the type is 'core::bytes_31::bytes31', false otherwise.
 */
export const isTypeBytes31 = (type) => type === 'core::bytes_31::bytes31';
/**
 * Checks if the given type is equal to the 'core::byte_array::ByteArray'.
 *
 * @param {string} type - The type to check.
 * @returns - True if the given type is equal to 'core::byte_array::ByteArray', false otherwise.
 */
export const isTypeByteArray = (type) => type === 'core::byte_array::byteArray.js';
export const isTypeSecp256k1Point = (type) => type === 'core::starknet::secp256k1::Secp256k1Point';
export const isCairo1Type = (type) => type.includes('::');
/**
 * Retrieves the array type from the given type string.
 *
 * @param {string} type - The type string.
 * @returns - The array type.
 */
export const getArrayType = (type) => {
    if (isCairo1Type(type)) {
        return type.substring(type.indexOf('<') + 1, type.lastIndexOf('>'));
    }
    return type.replace('*', '');
};
/**
 * Test if an ABI comes from a Cairo 1 contract
 * @param abi representing the interface of a Cairo contract
 * @returns TRUE if it is an ABI from a Cairo1 contract
 * @example
 * ```typescript
 * const isCairo1: boolean = isCairo1Abi(myAbi: Abi);
 * ```
 */
export function isCairo1Abi(abi) {
    const { cairo } = getAbiContractVersion(abi);
    if (cairo === undefined) {
        throw Error('Unable to determine Cairo version');
    }
    return cairo === '1';
}
/**
 * Return ContractVersion (Abi version) based on Abi
 * or undefined for unknown version
 * @param abi
 * @returns string
 */
export function getAbiContractVersion(abi) {
    // determine by interface for "Cairo 1.2"
    if (abi.find((it) => it.type === 'interface')) {
        return { cairo: '1', compiler: '2' };
    }
    // determine by function io types "Cairo 1.1" or "Cairo 0.0"
    // find first function with inputs or outputs
    const testFunction = abi.find((it) => it.type === 'function' && (it.inputs.length || it.outputs.length));
    if (!testFunction) {
        return { cairo: undefined, compiler: undefined };
    }
    const io = testFunction.inputs.length ? testFunction.inputs : testFunction.outputs;
    if (isCairo1Type(io[0].type)) {
        return { cairo: '1', compiler: '1' };
    }
    return { cairo: '0', compiler: '0' };
}
/**
 * named tuple cairo type is described as js object {}
 * struct cairo type are described as js object {}
 * array cairo type are described as js array []
 */
/**
 * Create Uint256 Cairo type (helper for common struct type)
 * @example
 * ```typescript
 * uint256('892349863487563453485768723498');
 * ```
 */
export const uint256 = (it) => {
    return new CairoUint256(it).toUint256DecimalString();
};
/**
 * Create Uint512 Cairo type (helper for common struct type)
 * @param it BigNumberish representation of a 512 bits unsigned number
 * @returns Uint512 struct
 * @example
 * ```typescript
 * uint512('345745685892349863487563453485768723498');
 * ```
 */
export const uint512 = (it) => {
    return new CairoUint512(it).toUint512DecimalString();
};
/**
 * Create unnamed tuple Cairo type (helper same as common struct type)
 * @example
 * ```typescript
 * tuple(1, '0x101', 16);
 * ```
 */
export const tuple = (...args) => ({ ...args });
/**
 * Create felt Cairo type (cairo type helper)
 * @returns format: felt-string
 */
export function felt(it) {
    return CairoFelt(it);
}
