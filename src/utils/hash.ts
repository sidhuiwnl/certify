import { keccak256, stringToBytes } from 'viem';

export function canonicalize(input: unknown): unknown {
    if (Array.isArray(input)) {
        return input.map(canonicalize);
    }
    if (input && typeof input === 'object') {
        const obj = input as Record<string, unknown>;
        return Object.keys(obj)
            .sort()
            .reduce<Record<string, unknown>>((acc, key) => {
                acc[key] = canonicalize(obj[key]);
                return acc;
            }, {});
    }
    return input;
}

export function computeContentHash(payload: Record<string, unknown>): string {
    const canonical = JSON.stringify(canonicalize(payload));
    return keccak256(stringToBytes(canonical));
}

export function toCertId(data: Record<string, unknown>): string {
    const canonical = JSON.stringify(canonicalize(data));
    return keccak256(stringToBytes(canonical));
}


