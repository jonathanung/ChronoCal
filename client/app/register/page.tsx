"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'; 
import bcrypt from 'bcryptjs';

export default function Login() {
    interface RegistrationUser {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        confirmPassword: string;
    }
    const [user, setUser] = useState<RegistrationUser>({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/;
    const passRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*.])[a-zA-Z0-9!@#$%^&*.]{8,}$/;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser(user => { return { ...user, [name]: value } })
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let newErrors: {[key: string]: string} = {};

        if (user.password !== user.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match!';
        }
        if (!emailRegex.test(user.email)) {
            newErrors.email = 'Invalid email!';
        }
        if (!passRegex.test(user.password)) {
            newErrors.password = 'Password must contain at least 8 characters, including numbers and special characters.';
        }
        if (user.firstName.trim() === '') {
            newErrors.firstName = 'First name is required!';
        }
        if (user.lastName.trim() === '') {
            newErrors.lastName = 'Last name is required!';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/register`, {
                    method: "post",
                    mode: "cors",
                    headers: { "Content-Type": "application/json" }, 
                    credentials: "include",
                    body: JSON.stringify({
                        "firstName": user.firstName,
                        "lastName": user.lastName,
                        "email": user.email,
                        "password": user.password,
                        "confirmPassword": user.confirmPassword
                    })
                }); 
                console.log(await response.json());
            } catch (error) {
                console.error('Invalid', error);
            }
        }
    };
    const router = useRouter();
    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/current`, {withCredentials: true})
            .then((response) => { 
                if (response.status === 200) {
                    router.push('/dashboard');
                }
            }).catch((err) => { });
    }, []); 

    return (
        <main className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-900">
            <div className="flex min-h-screen flex-col justify-center items-center px-6 py-12 lg:px-8">
                <h1 className="text-4xl font-bold mb-8 text-blue-600 dark:text-blue-400">Register for Chronocal</h1>

                <div className="w-full max-w-md">
                    <form className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="firstName">
                                First Name
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={user.firstName}
                                onChange={handleChange}
                                placeholder="Enter your first name"
                            />
                            {errors.firstName && <p className="text-red-500 text-xs italic">{errors.firstName}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="lastName">
                                Last Name
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={user.lastName}
                                onChange={handleChange}
                                placeholder="Enter your last name"
                            />
                            {errors.lastName && <p className="text-red-500 text-xs italic">{errors.lastName}</p>}
                        </div>
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
                            {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
                        </div>
                        <div className="mb-4">
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
                            </div>
                            {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                    type={showPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={user.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-red-500 text-xs italic">{errors.confirmPassword}</p>}
                        </div>
                        <div className="flex items-center justify-between">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                Register
                            </button>
                        </div>
                    </form>
                    <p className="text-center text-gray-500 text-xs">
                        Already have an account? <a href="/login" className="text-blue-500 hover:text-blue-800">Login</a>
                    </p>
                </div>
            </div>
        </main>
    );
}