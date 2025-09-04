import React, { useState, useEffect } from 'react';
import thirdwebApi from '../services/thirdwebApi';
import { WalletInfoProps, WalletInfo as WalletInfoType } from '../types/thirdweb';

const WalletInfo: React.FC<WalletInfoProps> = ({ authResult, onLogout }) => {
    const [walletData, setWalletData] = useState<WalletInfoType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchWalletInfo = async (): Promise<void> => {
            console.log('💼 [WALLET] Fetching wallet information...');
            console.log('🔍 [WALLET] Auth result:', authResult);

            try {
                const token = localStorage.getItem('thirdweb_token');
                if (token) {
                    console.log('🎫 [WALLET] Token found, making API call...');
                    const data = await thirdwebApi.getWalletInfo(token);
                    console.log('✅ [WALLET] Wallet info fetched successfully:', data);
                    setWalletData(data.result);
                } else {
                    console.error('❌ [WALLET] No token found in localStorage');
                    setError('No authentication token found.');
                }
            } catch (err: any) {
                console.error('❌ [WALLET] Failed to fetch wallet information:', err);
                setError(err.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchWalletInfo();
    }, [authResult]);

    const formatAddress = (address: string | undefined): string => {
        if (!address) return 'N/A';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const copyToClipboard = (text: string): void => {
        navigator.clipboard.writeText(text);
        // You could add a toast notification here
    };

    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen p-5">
                <div className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-dark-800/50 p-10 w-full max-w-2xl">
                    <div className="flex flex-col items-center gap-4 p-10">
                        <div className="w-10 h-10 border-4 border-dark-800 border-t-primary-500 rounded-full animate-spin"></div>
                        <p className="text-primary-400">Loading wallet information...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen p-5">
                <div className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-dark-800/50 p-10 w-full max-w-2xl">
                    <div className="text-center p-10">
                        <h3 className="text-red-400 mb-3 text-xl font-semibold">Error loading wallet</h3>
                        <p className="text-primary-400 mb-6">{error}</p>
                        <button
                            onClick={onLogout}
                            className="px-5 py-2.5 bg-red-600 text-white border-none rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:bg-red-700 hover:-translate-y-0.5"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen p-5">
            <div className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-dark-800/50 p-10 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-8 pb-5 border-b-2 border-dark-800/50">
                    <h1 className="text-3xl font-bold text-white m-0">Wallet Connected</h1>
                    <button
                        onClick={onLogout}
                        className="px-5 py-2.5 bg-red-600 text-white border-none rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:bg-red-700 hover:-translate-y-0.5"
                    >
                        Disconnect
                    </button>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-dark-800/50">
                        <h3 className="mb-4 text-white text-xl font-semibold">Wallet Address</h3>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-lg font-semibold text-white bg-dark-990/80 px-3 py-2 rounded-md border border-dark-800">
                                {formatAddress(walletData?.address)}
                            </span>
                            <button
                                className="bg-primary-600 text-white border-none rounded-md px-3 py-2 cursor-pointer text-base transition-all duration-200 hover:bg-primary-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                onClick={() => walletData?.address && copyToClipboard(walletData.address)}
                                title="Copy full address"
                                disabled={!walletData?.address}
                            >
                                📋
                            </button>
                        </div>
                        <p className="font-mono text-sm text-primary-500 break-all m-0">{walletData?.address}</p>
                    </div>

                    {walletData?.smartWalletAddress && (
                        <div className="bg-dark-700/50 backdrop-blur-sm rounded-xl p-6 border border-dark-600/30">
                            <h3 className="mb-4 text-white text-xl font-semibold">Smart Wallet Address</h3>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="font-mono text-lg font-semibold text-white bg-dark-600/50 px-3 py-2 rounded-md border border-dark-500">
                                    {formatAddress(walletData.smartWalletAddress)}
                                </span>
                                <button
                                    className="bg-primary-600 text-white border-none rounded-md px-3 py-2 cursor-pointer text-base transition-all duration-200 hover:bg-primary-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    onClick={() => walletData.smartWalletAddress && copyToClipboard(walletData.smartWalletAddress)}
                                    title="Copy full address"
                                    disabled={!walletData.smartWalletAddress}
                                >
                                    📋
                                </button>
                            </div>
                            <p className="font-mono text-sm text-primary-400 break-all m-0">{walletData.smartWalletAddress}</p>
                        </div>
                    )}

                    <div className="bg-dark-700/50 backdrop-blur-sm rounded-xl p-6 border border-dark-600/30">
                        <h3 className="mb-4 text-white text-xl font-semibold">Account Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="font-medium text-primary-400 text-sm">Created:</span>
                                <span className="text-white font-semibold">{formatDate(walletData?.createdAt)}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="font-medium text-primary-400 text-sm">Type:</span>
                                <span className="text-white font-semibold">{authResult?.type || 'N/A'}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="font-medium text-primary-400 text-sm">New User:</span>
                                <span className="text-white font-semibold">{authResult?.isNewUser ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                    </div>

                    {walletData?.profiles && walletData.profiles.length > 0 && (
                        <div className="bg-dark-700/50 backdrop-blur-sm rounded-xl p-6 border border-dark-600/30">
                            <h3 className="mb-4 text-white text-xl font-semibold">Connected Profiles</h3>
                            <div className="flex flex-col gap-4">
                                {walletData.profiles.map((profile, index) => (
                                    <div key={index} className="bg-dark-600/30 rounded-lg p-4 border border-dark-500/30">
                                        <div className="flex items-center gap-3 mb-3">
                                            {profile.picture && (
                                                <img
                                                    src={profile.picture}
                                                    alt={profile.name || 'Profile'}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            )}
                                            <div>
                                                {profile.name && (
                                                    <h4 className="m-0 text-white text-base">{profile.name}</h4>
                                                )}
                                                <p className="m-0 text-primary-400 text-sm capitalize">{profile.type}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            {profile.email && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="font-medium text-primary-400 min-w-16">Email:</span>
                                                    <span className="text-white">{profile.email}</span>
                                                    {profile.emailVerified && (
                                                        <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">✓ Verified</span>
                                                    )}
                                                </div>
                                            )}
                                            {profile.locale && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="font-medium text-primary-400 min-w-16">Locale:</span>
                                                    <span className="text-white">{profile.locale}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default WalletInfo;
