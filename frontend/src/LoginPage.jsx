import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = ({ onLogin }) => {
    // Toggle between Login and Register
    const [isRegistering, setIsRegistering] = useState(false);

    // Form State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        const endpoint = isRegistering
            ? 'http://localhost:8080/api/users/register'
            : 'http://localhost:8080/api/users/login';

        try {
            const res = await axios.post(endpoint, { username, password });

            if (isRegistering) {
                // REGISTER SUCCESS
                setSuccessMsg(`User '${res.data.username}' created! Please log in.`);
                setIsRegistering(false); // Switch back to login form
                setPassword(''); // Clear password for safety
            } else {
                // LOGIN SUCCESS
                onLogin(res.data);
            }
        } catch (err) {
            setError(isRegistering
                ? 'Username already taken or invalid data.'
                : 'Invalid username or password.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md transition-all duration-300">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {isRegistering ? '📝 Create Account' : '🚀 Auction Login'}
                    </h1>
                    <p className="text-gray-500 mt-2">
                        {isRegistering ? 'Join the bidding war' : 'Enter your credentials to bid'}
                    </p>
                </div>

                {/* Messages */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}
                {successMsg && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full py-2 rounded-lg font-bold text-white shadow-md transition-colors ${
                            isRegistering ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {isRegistering ? 'Register' : 'Sign In'}
                    </button>
                </form>

                {/* Toggle Link */}
                <div className="mt-6 text-center text-sm">
                    <span className="text-gray-500">
                        {isRegistering ? "Already have an account? " : "Don't have an account? "}
                    </span>
                    <button
                        onClick={() => {
                            setIsRegistering(!isRegistering);
                            setError('');
                            setSuccessMsg('');
                        }}
                        className="text-blue-600 font-bold hover:underline"
                    >
                        {isRegistering ? 'Login here' : 'Register here'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;