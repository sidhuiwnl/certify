/* Lightweight MetaMask helpers for wallet connection and hash generation */

import { keccak256, toBytes } from 'viem';

declare global {
    interface Window {
        ethereum?: any;
    }
}

export function isEthereumAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
}

export async function requestAccounts(): Promise<string[]> {
    if (!isEthereumAvailable()) return [];
    try {
        const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        return accounts;
    } catch (error) {
        console.error('eth_requestAccounts failed', error);
        return [];
    }
}

export async function getChainId(): Promise<string | null> {
    if (!isEthereumAvailable()) return null;
    try {
        const chainId: string = await window.ethereum.request({ method: 'eth_chainId' });
        return chainId;
    } catch (error) {
        console.error('eth_chainId failed', error);
        return null;
    }
}

export function shortenAddress(address?: string | null): string {
    if (!address) return '';
    return address.slice(0, 6) + '…' + address.slice(-4);
}

export async function generateCertificateHash(data: Record<string, any>): Promise<string> {
    // Sort the data to ensure consistent hash
    const sortedData = Object.keys(data)
        .sort()
        .reduce((obj: Record<string, any>, key) => {
            obj[key] = data[key];
            return obj;
        }, {});

    // Convert to string and then to bytes
    const jsonStr = JSON.stringify(sortedData);
    const bytes = toBytes(jsonStr);

    // Generate keccak256 hash
    return keccak256(bytes);
}
