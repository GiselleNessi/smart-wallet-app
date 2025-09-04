import React, { useState, useEffect } from 'react';
import thirdwebApi from '../services/thirdwebApi';
import { AllUsersResponse, SingleUserResponse, UserQuery, WalletInfo } from '../types/thirdweb';

const UserManagement: React.FC = () => {
    const [allUsers, setAllUsers] = useState<WalletInfo[]>([]);
    const [singleUser, setSingleUser] = useState<WalletInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'all' | 'single'>('all');
    const [pagination, setPagination] = useState({ hasMore: false, limit: 20, page: 1 });

    // Single user search form
    const [searchType, setSearchType] = useState<'address' | 'email' | 'phone' | 'externalWalletAddress' | 'id'>('email');
    const [searchValue, setSearchValue] = useState<string>('');

    // Fetch all users
    const fetchAllUsers = async (page: number = 1): Promise<void> => {
        setLoading(true);
        setError('');

        try {
            const response: AllUsersResponse = await thirdwebApi.getAllUsers(20, page);
            if (page === 1) {
                setAllUsers(response.result.wallets);
            } else {
                setAllUsers(prev => [...prev, ...response.result.wallets]);
            }
            setPagination(response.result.pagination);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    // Fetch single user
    const fetchSingleUser = async (): Promise<void> => {
        if (!searchValue.trim()) {
            setError('Please enter a search value');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const query: UserQuery = { [searchType]: searchValue };
            const response: SingleUserResponse = await thirdwebApi.getSingleUser(query);
            setSingleUser(response.result);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch user');
            setSingleUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Load more users
    const loadMoreUsers = (): void => {
        if (pagination.hasMore && !loading) {
            fetchAllUsers(pagination.page + 1);
        }
    };

    // Format address for display
    const formatAddress = (address: string | undefined): string => {
        if (!address) return 'N/A';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    // Format date
    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    // Copy to clipboard
    const copyToClipboard = (text: string): void => {
        navigator.clipboard.writeText(text);
    };

    useEffect(() => {
        if (activeTab === 'all') {
            fetchAllUsers();
        }
    }, [activeTab]);

    return (
        <div className="flex justify-center items-start min-h-screen p-5">
            <div className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-dark-800/50 p-10 w-full max-w-4xl">
                <h1 className="text-3xl font-bold text-white text-center mb-8">User Management</h1>

                <div className="flex bg-black/60 rounded-lg p-1 mb-8 border border-dark-800/50">
                    <button
                        className={`flex-1 py-3 px-4 border-none rounded-md font-medium cursor-pointer transition-all duration-200 ${activeTab === 'all'
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                            : 'bg-transparent text-primary-400 hover:text-primary-300'
                            }`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Users
                    </button>
                    <button
                        className={`flex-1 py-3 px-4 border-none rounded-md font-medium cursor-pointer transition-all duration-200 ${activeTab === 'single'
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                            : 'bg-transparent text-primary-400 hover:text-primary-300'
                            }`}
                        onClick={() => setActiveTab('single')}
                    >
                        Find User
                    </button>
                </div>

                {error && (
                    <div className="bg-red-950/80 text-red-300 p-3 rounded-lg mb-6 border border-red-800/50 text-sm backdrop-blur-sm">
                        {error}
                    </div>
                )}

                {activeTab === 'all' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl text-gray-800 m-0">All Users ({allUsers.length})</h2>
                            <button
                                className="px-4 py-2 bg-primary-500 text-white border-none rounded-md font-medium cursor-pointer transition-all duration-200 hover:bg-primary-600 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                                onClick={() => fetchAllUsers()}
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Refresh'}
                            </button>
                        </div>

                        {loading && allUsers.length === 0 ? (
                            <div className="flex flex-col items-center gap-4 p-10">
                                <div className="w-10 h-10 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin"></div>
                                <p className="text-gray-600">Loading users...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {allUsers.map((user, index) => (
                                    <div key={index} className="bg-gray-50 rounded-xl p-5 border border-gray-200 transition-all duration-200 hover:border-gray-300 hover:shadow-md">
                                        <div className="flex flex-col gap-2 mb-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-500 min-w-20">Address:</span>
                                                <span className="font-mono text-sm text-gray-800 bg-white px-2 py-1 rounded border border-gray-200">
                                                    {formatAddress(user.address)}
                                                </span>
                                                <button
                                                    className="bg-primary-500 text-white border-none rounded px-2 py-1 cursor-pointer text-xs transition-all duration-200 hover:bg-primary-600 hover:scale-105"
                                                    onClick={() => user.address && copyToClipboard(user.address)}
                                                    title="Copy full address"
                                                >
                                                    📋
                                                </button>
                                            </div>
                                            {user.smartWalletAddress && (
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-500 min-w-20">Smart Wallet:</span>
                                                    <span className="font-mono text-sm text-gray-800 bg-white px-2 py-1 rounded border border-gray-200">
                                                        {formatAddress(user.smartWalletAddress)}
                                                    </span>
                                                    <button
                                                        className="bg-primary-500 text-white border-none rounded px-2 py-1 cursor-pointer text-xs transition-all duration-200 hover:bg-primary-600 hover:scale-105"
                                                        onClick={() => user.smartWalletAddress && copyToClipboard(user.smartWalletAddress)}
                                                        title="Copy full address"
                                                    >
                                                        📋
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-medium text-gray-500 text-sm">Created:</span>
                                                <span className="text-gray-800 font-semibold">{formatDate(user.createdAt)}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-medium text-gray-500 text-sm">Profiles:</span>
                                                <span className="text-gray-800 font-semibold">{user.profiles.length}</span>
                                            </div>
                                        </div>

                                        {user.profiles.length > 0 && (
                                            <div className="border-t border-gray-200 pt-4">
                                                <h4 className="mb-3 text-gray-800 text-base">Connected Profiles:</h4>
                                                {user.profiles.map((profile, profileIndex) => (
                                                    <div key={profileIndex} className="flex items-center gap-3 p-2 bg-white rounded border border-gray-200 mb-2">
                                                        <span className="bg-primary-500 text-white px-2 py-1 rounded text-xs font-semibold capitalize">
                                                            {profile.type}
                                                        </span>
                                                        {profile.email && (
                                                            <span className="text-gray-800 text-sm">{profile.email}</span>
                                                        )}
                                                        {profile.name && (
                                                            <span className="text-gray-800 text-sm">{profile.name}</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {pagination.hasMore && (
                                    <button
                                        className="w-full py-3 px-6 bg-transparent text-primary-500 border-2 border-primary-500 rounded-lg font-semibold cursor-pointer transition-all duration-200 mt-6 hover:bg-primary-500 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
                                        onClick={loadMoreUsers}
                                        disabled={loading}
                                    >
                                        {loading ? 'Loading...' : 'Load More'}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'single' && (
                    <div>
                        <h2 className="text-2xl text-gray-800 mb-6">Find User</h2>

                        <div className="mb-8">
                            <div className="flex gap-3 items-center">
                                <select
                                    value={searchType}
                                    onChange={(e) => setSearchType(e.target.value as any)}
                                    className="p-3 border-2 border-gray-200 rounded-lg bg-white text-gray-800 font-medium cursor-pointer min-w-40 focus:outline-none focus:border-primary-500 focus:ring-3 focus:ring-primary-100"
                                >
                                    <option value="email">Email</option>
                                    <option value="phone">Phone</option>
                                    <option value="address">Wallet Address</option>
                                    <option value="externalWalletAddress">External Wallet</option>
                                    <option value="id">User ID</option>
                                </select>

                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder={`Enter ${searchType}`}
                                    className="flex-1 p-3 border-2 border-gray-200 rounded-lg text-base transition-colors duration-200 focus:outline-none focus:border-primary-500 focus:ring-3 focus:ring-primary-100"
                                />

                                <button
                                    className="py-3 px-6 bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-none rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none min-w-24"
                                    onClick={fetchSingleUser}
                                    disabled={loading}
                                >
                                    {loading ? 'Searching...' : 'Search'}
                                </button>
                            </div>
                        </div>

                        {singleUser && (
                            <div className="mt-6">
                                <h3 className="text-xl text-gray-800 mb-4">User Found</h3>
                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                    <div className="flex flex-col gap-2 mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-500 min-w-20">Address:</span>
                                            <span className="font-mono text-sm text-gray-800 bg-white px-2 py-1 rounded border border-gray-200">
                                                {formatAddress(singleUser.address)}
                                            </span>
                                            <button
                                                className="bg-primary-500 text-white border-none rounded px-2 py-1 cursor-pointer text-xs transition-all duration-200 hover:bg-primary-600 hover:scale-105"
                                                onClick={() => singleUser.address && copyToClipboard(singleUser.address)}
                                                title="Copy full address"
                                            >
                                                📋
                                            </button>
                                        </div>
                                        {singleUser.smartWalletAddress && (
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-500 min-w-20">Smart Wallet:</span>
                                                <span className="font-mono text-sm text-gray-800 bg-white px-2 py-1 rounded border border-gray-200">
                                                    {formatAddress(singleUser.smartWalletAddress)}
                                                </span>
                                                <button
                                                    className="bg-primary-500 text-white border-none rounded px-2 py-1 cursor-pointer text-xs transition-all duration-200 hover:bg-primary-600 hover:scale-105"
                                                    onClick={() => singleUser.smartWalletAddress && copyToClipboard(singleUser.smartWalletAddress)}
                                                    title="Copy full address"
                                                >
                                                    📋
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-medium text-gray-500 text-sm">Created:</span>
                                            <span className="text-gray-800 font-semibold">{formatDate(singleUser.createdAt)}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="font-medium text-gray-500 text-sm">Profiles:</span>
                                            <span className="text-gray-800 font-semibold">{singleUser.profiles.length}</span>
                                        </div>
                                    </div>

                                    {singleUser.profiles.length > 0 && (
                                        <div className="border-t border-gray-200 pt-4">
                                            <h4 className="mb-3 text-gray-800 text-base">Connected Profiles:</h4>
                                            {singleUser.profiles.map((profile, profileIndex) => (
                                                <div key={profileIndex} className="flex items-center gap-3 p-2 bg-white rounded border border-gray-200 mb-2">
                                                    <span className="bg-primary-500 text-white px-2 py-1 rounded text-xs font-semibold capitalize">
                                                        {profile.type}
                                                    </span>
                                                    {profile.email && (
                                                        <span className="text-gray-800 text-sm">{profile.email}</span>
                                                    )}
                                                    {profile.name && (
                                                        <span className="text-gray-800 text-sm">{profile.name}</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
