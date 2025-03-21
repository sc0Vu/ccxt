/* eslint-disable no-param-reassign */
import { PRIME, RANGE_FELT, RANGE_I128, RANGE_U128 } from '../constants.js';
import { TypedDataRevision as Revision, } from '../types/index.js';
import assert from './assert.js';
import { byteArrayFromString } from './calldata/byteArray.js';
import { computePedersenHash, computePedersenHashOnElements, computePoseidonHash, computePoseidonHashOnElements, getSelectorFromName, } from './hash/index.js';
import { MerkleTree } from './merkle.js';
import { isHex, toHex } from './num.js';
import { encodeShortString, isString } from './shortString.js';
const presetTypes = {
    u256: JSON.parse('[{ "name": "low", "type": "u128" }, { "name": "high", "type": "u128" }]'),
    TokenAmount: JSON.parse('[{ "name": "token_address", "type": "ContractAddress" }, { "name": "amount", "type": "u256" }]'),
    NftId: JSON.parse('[{ "name": "collection_address", "type": "ContractAddress" }, { "name": "token_id", "type": "u256" }]'),
};
const revisionConfiguration = {
    [Revision.Active]: {
        domain: 'StarknetDomain',
        hashMethod: computePoseidonHashOnElements,
        hashMerkleMethod: computePoseidonHash,
        escapeTypeString: (s) => `"${s}"`,
        presetTypes,
    },
    [Revision.Legacy]: {
        domain: 'StarkNetDomain',
        hashMethod: computePedersenHashOnElements,
        hashMerkleMethod: computePedersenHash,
        escapeTypeString: (s) => s,
        presetTypes: {},
    },
};
function assertRange(data, type, { min, max }) {
    const value = BigInt(data);
    assert(value >= min && value <= max, `${value} (${type}) is out of bounds [${min}, ${max}]`);
}
function identifyRevision({ types, domain }) {
    if (revisionConfiguration[Revision.Active].domain in types && domain.revision === Revision.Active)
        return Revision.Active;
    if (revisionConfiguration[Revision.Legacy].domain in types &&
        (domain.revision ?? Revision.Legacy) === Revision.Legacy)
        return Revision.Legacy;
    return undefined;
}
function getHex(value) {
    try {
        return toHex(value);
    }
    catch (e) {
        if (isString(value)) {
            return toHex(encodeShortString(value));
        }
        throw new Error(`Invalid BigNumberish: ${value}`);
    }
}
/**
 * Validates that `data` matches the EIP-712 JSON schema.
 */
function validateTypedData(data) {
    const typedData = data;
    return Boolean(typedData.message && typedData.primaryType && typedData.types && identifyRevision(typedData));
}
/**
 * Prepares the selector for use.
 *
 * @param {string} selector - The selector to be prepared.
 * @returns {string} The prepared selector.
 */
export function prepareSelector(selector) {
    return isHex(selector) ? selector : getSelectorFromName(selector);
}
/**
 * Checks if the given Starknet type is a Merkle tree type.
 *
 * @param {StarknetType} type - The StarkNet type to check.
 *
 * @returns {boolean} - True if the type is a Merkle tree type, false otherwise.
 */
export function isMerkleTreeType(type) {
    return type.type === 'merkletree';
}
/**
 * Get the dependencies of a struct type. If a struct has the same dependency multiple times, it's only included once
 * in the resulting array.
 */
export function getDependencies(types, type, dependencies = [], contains = '', revision = Revision.Legacy) {
    // Include pointers (struct arrays)
    if (type[type.length - 1] === '*') {
        type = type.slice(0, -1);
    }
    else if (revision === Revision.Active) {
        // enum base
        if (type === 'enum') {
            type = contains;
        }
        // enum element types
        else if (type.match(/^\(.*\)$/)) {
            type = type.slice(1, -1);
        }
    }
    if (dependencies.includes(type) || !types[type]) {
        return dependencies;
    }
    return [
        type,
        ...types[type].reduce((previous, t) => [
            ...previous,
            ...getDependencies(types, t.type, previous, t.contains, revision).filter((dependency) => !previous.includes(dependency)),
        ], []),
    ];
}
function getMerkleTreeType(types, ctx) {
    if (ctx.parent && ctx.key) {
        const parentType = types[ctx.parent];
        const merkleType = parentType.find((t) => t.name === ctx.key);
        const isMerkleTree = isMerkleTreeType(merkleType);
        if (!isMerkleTree) {
            throw new Error(`${ctx.key} is not a merkle tree`);
        }
        if (merkleType.contains.endsWith('*')) {
            throw new Error(`Merkle tree contain property must not be an array but was given ${ctx.key}`);
        }
        return merkleType.contains;
    }
    return 'raw';
}
/**
 * Encode a type to a string. All dependent types are alphabetically sorted.
 */
export function encodeType(types, type, revision = Revision.Legacy) {
    const allTypes = revision === Revision.Active
        ? { ...types, ...revisionConfiguration[revision].presetTypes }
        : types;
    const [primary, ...dependencies] = getDependencies(allTypes, type, undefined, undefined, revision);
    const newTypes = !primary ? [] : [primary, ...dependencies.sort()];
    const esc = revisionConfiguration[revision].escapeTypeString;
    return newTypes
        .map((dependency) => {
        const dependencyElements = allTypes[dependency].map((t) => {
            const targetType = t.type === 'enum' && revision === Revision.Active
                ? t.contains
                : t.type;
            // parentheses handling for enum variant types
            const typeString = targetType.match(/^\(.*\)$/)
                ? `(${targetType
                    .slice(1, -1)
                    .split(',')
                    .map((e) => (e ? esc(e) : e))
                    .join(',')})`
                : esc(targetType);
            return `${esc(t.name)}:${typeString}`;
        });
        return `${esc(dependency)}(${dependencyElements})`;
    })
        .join('');
}
/**
 * Get a type string as hash.
 */
export function getTypeHash(types, type, revision = Revision.Legacy) {
    return getSelectorFromName(encodeType(types, type, revision));
}
/**
 * Encodes a single value to an ABI serialisable string, number or Buffer. Returns the data as tuple, which consists of
 * an array of ABI compatible types, and an array of corresponding values.
 */
export function encodeValue(types, type, data, ctx = {}, revision = Revision.Legacy) {
    if (types[type]) {
        return [type, getStructHash(types, type, data, revision)];
    }
    if (revisionConfiguration[revision].presetTypes[type]) {
        return [
            type,
            getStructHash(revisionConfiguration[revision].presetTypes, type, data, revision),
        ];
    }
    if (type.endsWith('*')) {
        const hashes = data.map((entry) => encodeValue(types, type.slice(0, -1), entry, undefined, revision)[1]);
        return [type, revisionConfiguration[revision].hashMethod(hashes)];
    }
    switch (type) {
        case 'enum': {
            if (revision === Revision.Active) {
                const [variantKey, variantData] = Object.entries(data)[0];
                const parentType = types[ctx.parent][0];
                const enumType = types[parentType.contains];
                const variantType = enumType.find((t) => t.name === variantKey);
                const variantIndex = enumType.indexOf(variantType);
                const encodedSubtypes = variantType.type
                    .slice(1, -1)
                    .split(',')
                    .map((subtype, index) => {
                    if (!subtype)
                        return subtype;
                    const subtypeData = variantData[index];
                    return encodeValue(types, subtype, subtypeData, undefined, revision)[1];
                });
                return [
                    type,
                    revisionConfiguration[revision].hashMethod([variantIndex, ...encodedSubtypes]),
                ];
            } // else fall through to default
            return [type, getHex(data)];
        }
        case 'merkletree': {
            const merkleTreeType = getMerkleTreeType(types, ctx);
            const structHashes = data.map((struct) => {
                return encodeValue(types, merkleTreeType, struct, undefined, revision)[1];
            });
            const { root } = new MerkleTree(structHashes, revisionConfiguration[revision].hashMerkleMethod);
            return ['felt', root];
        }
        case 'selector': {
            return ['felt', prepareSelector(data)];
        }
        case 'string': {
            if (revision === Revision.Active) {
                const byteArray = byteArrayFromString(data);
                const elements = [
                    byteArray.data.length,
                    ...byteArray.data,
                    byteArray.pending_word,
                    byteArray.pending_word_len,
                ];
                return [type, revisionConfiguration[revision].hashMethod(elements)];
            } // else fall through to default
            return [type, getHex(data)];
        }
        case 'i128': {
            if (revision === Revision.Active) {
                const value = BigInt(data);
                assertRange(value, type, RANGE_I128);
                return [type, getHex(value < 0n ? PRIME + value : value)];
            } // else fall through to default
            return [type, getHex(data)];
        }
        case 'timestamp':
        case 'u128': {
            if (revision === Revision.Active) {
                assertRange(data, type, RANGE_U128);
            } // else fall through to default
            return [type, getHex(data)];
        }
        case 'felt':
        case 'shortstring': {
            // TODO: should 'shortstring' diverge into directly using encodeShortString()?
            if (revision === Revision.Active) {
                assertRange(getHex(data), type, RANGE_FELT);
            } // else fall through to default
            return [type, getHex(data)];
        }
        case 'ClassHash':
        case 'ContractAddress': {
            if (revision === Revision.Active) {
                assertRange(data, type, RANGE_FELT);
            } // else fall through to default
            return [type, getHex(data)];
        }
        case 'bool': {
            if (revision === Revision.Active) {
                assert(typeof data === 'boolean', `Type mismatch for ${type} ${data}`);
            } // else fall through to default
            return [type, getHex(data)];
        }
        default: {
            if (revision === Revision.Active) {
                throw new Error(`Unsupported type: ${type}`);
            }
            return [type, getHex(data)];
        }
    }
}
/**
 * Encode the data to an ABI encoded Buffer. The data should be a key -> value object with all the required values.
 * All dependent types are automatically encoded.
 */
export function encodeData(types, type, data, revision = Revision.Legacy) {
    const targetType = types[type] ?? revisionConfiguration[revision].presetTypes[type];
    const [returnTypes, values] = targetType.reduce(([ts, vs], field) => {
        if (data[field.name] === undefined ||
            (data[field.name] === null && field.type !== 'enum')) {
            throw new Error(`Cannot encode data: missing data for '${field.name}'`);
        }
        const value = data[field.name];
        const ctx = { parent: type, key: field.name };
        const [t, encodedValue] = encodeValue(types, field.type, value, ctx, revision);
        return [
            [...ts, t],
            [...vs, encodedValue],
        ];
    }, [['felt'], [getTypeHash(types, type, revision)]]);
    return [returnTypes, values];
}
/**
 * Get encoded data as a hash. The data should be a key -> value object with all the required values.
 * All dependent types are automatically encoded.
 */
export function getStructHash(types, type, data, revision = Revision.Legacy) {
    return revisionConfiguration[revision].hashMethod(encodeData(types, type, data, revision)[1]);
}
/**
 * Get the SNIP-12 encoded message to sign, from the typedData object.
 */
export function getMessageHash(typedData, account) {
    if (!validateTypedData(typedData)) {
        throw new Error('Typed data does not match JSON schema');
    }
    const revision = identifyRevision(typedData);
    const { domain, hashMethod } = revisionConfiguration[revision];
    const message = [
        encodeShortString('StarkNet Message'),
        getStructHash(typedData.types, domain, typedData.domain, revision),
        account,
        getStructHash(typedData.types, typedData.primaryType, typedData.message, revision),
    ];
    return hashMethod(message);
}
