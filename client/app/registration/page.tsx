"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'; 
import bcrypt from 'bcryptjs';

export default function Login() {
    interface RegistrationUser {
        username: string;
        email: string;
        password: string;
        confirmPassword: string;
    }
    const [user, setUser] = useState<RegistrationUser>({ username: '', email: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState<boolean>(false);

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
        if (user.password !== user.confirmPassword) {
            console.error('Passwords do not match!');
            return;
        }
        if (!emailRegex.test(user.email)) {
            console.error('Invalid email!');
            return;
        }
        if (!passRegex.test(user.password)) {
            console.error('Invalid password!');
            return;
        }
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/register`, {
                method: "post",
                mode: "cors",
                headers: { "Content-Type": "application/json" }, 
                credentials: "include",
                body: JSON.stringify({
                    "username": user.username,
                    "email": user.email,
                    "password": user.password,
                    "confirmPassword": user.confirmPassword
                })
            }); 
            console.log(await response.json());
        } catch (error) {
            console.error('Invalid', error);
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
        <main className="">
            <div className="flex min-h-screen flex-col justify-center items-center px-6 py-12 lg:px-8">
                <h4>Login to Chronocal</h4>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm text-black dark:text-white">
                    <form className="space-y-6 border p-4 rounded-md border-black dark:border-white" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={user.username}
                                onChange={handleChange}
                                className="mt-1 block w-full border p-2 rounded-md text-black"
                            />
                        </div>
                        <div>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                className="mt-1 block w-full border p-2 rounded-md text-black"
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Password:</label>
                            <div className="flex items-center">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={user.password}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border p-2 rounded-md text-black"
                                />
                            </div>
                        </div>
                            <div>
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                            <div className="flex items-center">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={user.confirmPassword}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border p-2 rounded-md text-black"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="text-sm text-blue-500"
                            >
                                {showPassword ? 'Hide' : 'Show'} Passwords
                            </button>
                        </div>
                        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                            Login
                        </button>
                    </form>
                </div>
                <h4>Already have an account? <a href="/login" className="text-blue-500">Login</a></h4>
            </div>
        </main>
    );
}