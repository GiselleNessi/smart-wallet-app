import React, { useState, useEffect } from 'react';
import AuthForm from './components/AuthForm';
import WalletInfo from './components/WalletInfo';
import UserManagement from './components/UserManagement';
import { CompleteAuthResponse } from './types/thirdweb';

function App(): JSX.Element {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [authResult, setAuthResult] = useState<CompleteAuthResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeView, setActiveView] = useState<'auth' | 'wallet' | 'users'>('auth');

    useEffect(() => {
        console.log('🔄 [APP] App component mounted');
        console.log('🔍 [APP] Checking for existing token...');

        const token = localStorage.getItem('thirdweb_token');
        if (token) {
            console.log('🎫 [APP] Found existing token, but requiring re-authentication');
            console.log('🧹 [APP] Clearing stored token for security');
            localStorage.removeItem('thirdweb_token');
        } else {
            console.log('🚫 [APP] No existing token found');
        }

        console.log('🔐 [APP] Authentication state: NOT AUTHENTICATED (fresh start)');
        setIsAuthenticated(false);
        setLoading(false);
    }, []);

    const handleAuthSuccess = (result: CompleteAuthResponse): void => {
        console.log('🎉 [APP] Authentication successful!');
        console.log('👤 [APP] User data:', result);
        console.log('🎫 [APP] Token stored in localStorage');
        console.log('🔐 [APP] Authentication state: AUTHENTICATED');

        setAuthResult(result);
        setIsAuthenticated(true);
        setActiveView('wallet');
    };

    const handleLogout = (): void => {
        console.log('🚪 [APP] User logging out');
        console.log('🧹 [APP] Clearing token from localStorage');
        console.log('🔐 [APP] Authentication state: NOT AUTHENTICATED');

        localStorage.removeItem('thirdweb_token');
        setIsAuthenticated(false);
        setAuthResult(null);
        setActiveView('auth');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-dark-990 to-dark-975">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-primary-300 text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-dark-990 to-dark-975">
            <header className="bg-gradient-to-r from-black/80 to-dark-990/80 backdrop-blur-xl border-b border-dark-800/50 py-8 px-4 shadow-2xl">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">Smart Wallet App</h1>
                    <p className="text-lg md:text-xl text-primary-300 mb-5">
                        Login with email to create your smart wallet
                    </p>

                    {isAuthenticated && (
                        <nav className="flex gap-3 justify-center">
                            <button
                                className={`px-5 py-2.5 border-2 rounded-lg font-semibold cursor-pointer transition-all duration-200 backdrop-blur-sm ${activeView === 'wallet'
                                    ? 'bg-primary-600 text-white border-primary-500 shadow-lg shadow-primary-500/25'
                                    : 'bg-black/60 text-primary-400 border-dark-800 hover:bg-dark-990/60 hover:border-primary-500/50'
                                    } hover:-translate-y-0.5`}
                                onClick={() => setActiveView('wallet')}
                            >
                                My Wallet
                            </button>
                            <button
                                className={`px-5 py-2.5 border-2 rounded-lg font-semibold cursor-pointer transition-all duration-200 backdrop-blur-sm ${activeView === 'users'
                                    ? 'bg-primary-600 text-white border-primary-500 shadow-lg shadow-primary-500/25'
                                    : 'bg-black/60 text-primary-400 border-dark-800 hover:bg-dark-990/60 hover:border-primary-500/50'
                                    } hover:-translate-y-0.5`}
                                onClick={() => setActiveView('users')}
                            >
                                User Management
                            </button>
                        </nav>
                    )}
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-4">
                {!isAuthenticated ? (
                    <AuthForm onAuthSuccess={handleAuthSuccess} />
                ) : activeView === 'wallet' && authResult ? (
                    <WalletInfo authResult={authResult} onLogout={handleLogout} />
                ) : activeView === 'users' ? (
                    <UserManagement />
                ) : null}
            </main>

            <footer className="bg-black/60 backdrop-blur-xl border-t border-dark-800/50 text-white py-6 px-4 text-center">
                <p className="text-primary-400">
                    Built with{' '}
                    <a
                        href="https://thirdweb.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-300 hover:text-primary-200 transition-colors duration-200 hover:drop-shadow-lg"
                    >
                        Thirdweb API
                    </a>
                </p>
            </footer>
        </div>
    );
}

export default App;
