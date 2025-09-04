import React, { useState } from 'react';
import thirdwebApi from '../services/thirdwebApi';
import { AuthFormProps } from '../types/thirdweb';

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
    const [email, setEmail] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [step, setStep] = useState<'initiate' | 'verify'>('initiate');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleInitiateAuth = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        console.log('📧 [AUTH] Starting email authentication for:', email);
        setLoading(true);
        setError('');

        try {
            const result = await thirdwebApi.initiateEmailAuth(email);
            console.log('✅ [AUTH] Email auth initiated successfully:', result);
            console.log('📬 [AUTH] Moving to verification step');
            setStep('verify');
        } catch (err: any) {
            console.error('❌ [AUTH] Email auth initiation failed:', err);
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteAuth = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        console.log('🔐 [AUTH] Completing email authentication for:', email, 'with code:', code);
        setLoading(true);
        setError('');

        try {
            const result = await thirdwebApi.completeEmailAuth(email, code);
            console.log('✅ [AUTH] Email auth completed successfully:', result);
            console.log('🎫 [AUTH] Storing token in localStorage');
            localStorage.setItem('thirdweb_token', result.token);
            console.log('🎉 [AUTH] Calling onAuthSuccess callback');
            onAuthSuccess(result);
        } catch (err: any) {
            console.error('❌ [AUTH] Email auth completion failed:', err);
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = (): void => {
        setStep('initiate');
        setEmail('');
        setCode('');
        setError('');
    };

    return (
        <div className="flex justify-center items-start pt-20 p-5">
            <div className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-dark-800/50 p-10 w-full max-w-md">
                <h1 className="text-3xl font-bold text-white text-center mb-2">Login to Your App</h1>
                <p className="text-primary-400 text-center mb-8 text-base">Use email method to login. This will create a smart wallet for you in the background.</p>

                {error && (
                    <div className="bg-red-950/80 text-red-300 p-3 rounded-lg mb-6 border border-red-800/50 text-sm backdrop-blur-sm">
                        {error}
                    </div>
                )}

                {step === 'initiate' && (
                    <div>

                        <form onSubmit={handleInitiateAuth} className="mb-6">
                            <div className="mb-5">
                                <label htmlFor="email" className="block mb-2 font-medium text-primary-300">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="w-full p-3 border-2 border-dark-800 rounded-lg text-base transition-colors duration-200 bg-black/60 text-white placeholder-primary-500 focus:outline-none focus:border-primary-500 focus:ring-3 focus:ring-primary-500/20 backdrop-blur-sm"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 px-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 mb-4 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/25 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Login Code'}
                            </button>
                        </form>


                    </div>
                )}

                {step === 'verify' && (
                    <div className="text-center">
                        <h3 className="mb-2 text-white">Enter Verification Code</h3>
                        <p className="mb-6 text-primary-400 text-sm">
                            We've sent a verification code to your email. Enter it below to complete your login and create your smart wallet.
                        </p>

                        <form onSubmit={handleCompleteAuth}>
                            <div className="mb-5">
                                <label htmlFor="code" className="block mb-2 font-medium text-primary-300">Verification Code</label>
                                <input
                                    type="text"
                                    id="code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="Enter verification code"
                                    required
                                    className="w-full p-3 border-2 border-dark-800 rounded-lg text-base transition-colors duration-200 bg-black/60 text-white placeholder-primary-500 focus:outline-none focus:border-primary-500 focus:ring-3 focus:ring-primary-500/20 backdrop-blur-sm"
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    type="submit"
                                    className="w-full py-4 px-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/25 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                                    disabled={loading}
                                >
                                    {loading ? 'Logging in...' : 'Login & Create Wallet'}
                                </button>
                                <button
                                    type="button"
                                    className="w-full py-3 px-6 bg-transparent text-primary-400 border-2 border-primary-600 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-primary-600 hover:text-white"
                                    onClick={resetForm}
                                >
                                    Back
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthForm;
