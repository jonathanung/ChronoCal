"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'; 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Login() {
    const [user, setUser] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(''); // Clear any existing errors
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/user/login`, user, {
                withCredentials: true
            });
            if (response.status === 200) {
                router.push('/dashboard');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    if (error.response.status === 400) {
                        setError('Invalid email or password. Please try again.');
                    } else if (error.response.status === 404) {
                        setError('User not found. Please check your email or sign up.');
                    } else {
                        setError(`Login failed: ${error.response.data.message || 'Unknown error occurred'}`);
                    }
                } else if (error.request) {
                    // The request was made but no response was received
                    setError('No response received from server. Please try again later.');
                } else {
                    // Something happened in setting up the request that triggered an Error
                    setError('An error occurred while logging in. Please try again.');
                }
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
            console.error('Login error:', error);
        }
    };

    useEffect(() => {
        const checkCurrentUser = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/current`, { withCredentials: true });
                if (response.status === 200) {
                    router.push('/dashboard');
                }
            } catch (error) {
                // If there's an error, it means the user is not logged in, so we do nothing
                console.error('Error checking current user:', error);
            }
        };

        checkCurrentUser();
    }, []);

    return (
        <main className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-900">
            <div className="flex min-h-screen flex-col justify-center items-center px-6 py-12 lg:px-8">
                <h1 className="text-4xl font-bold mb-8 text-blue-600 dark:text-blue-400">Login to Chronocal</h1>

                <div className="w-full max-w-md">
                    <form className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                        {error && (
                            <div className="mb-4 text-red-500 text-sm font-bold">
                                {error}
                            </div>
                        )}
                        <div className="mb-4">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={user.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Button type="submit">
                                Sign In
                            </Button>
                            <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                                Forgot Password?
                            </a>
                        </div>
                    </form>
                    <p className="text-center text-gray-500 text-xs">
                        Don't have an account? <a href="/register" className="text-blue-500 hover:text-blue-800">Register</a>
                    </p>
                </div>
            </div>
        </main>
    );
}