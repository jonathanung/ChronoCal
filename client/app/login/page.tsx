"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'; 
import bcrypt from 'bcryptjs';

export default function Login() {
    interface LoginUser {
        email: string;
        password: string;
    }
    const [user, setUser] = useState<LoginUser>({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser(user => { return { ...user, [name]: value } })
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/login`, {
                method: "post",
                mode: "cors",
                headers: { "Content-Type": "application/json" }, 
                credentials: "include",
                body: JSON.stringify({
                    "email": user.email,
                    "password": user.password
                })
            }); 
            const data = await response.json();
            if (response.status === 200) {
                router.push('/dashboard');
            } else {
                setError(data.message || 'An error occurred during login');
            }
        } catch (error) {
            console.error('Invalid', error);
            setError('An unexpected error occurred. Please try again.');
        }
    };
    const router = useRouter();
    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/current`,{withCredentials: true})
            .then((response) => { 
                if (response.status === 200) {
                    router.push('/dashboard');
                }
            }).catch((err) => { });
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
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="email"
                                id="email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={user.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
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
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                Sign In
                            </button>
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