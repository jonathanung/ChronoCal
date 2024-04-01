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
            console.log(await response.json());
            if (response.status === 200) {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Invalid', error);
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
        <main className="">
            <div className="flex min-h-screen flex-col justify-center items-center px-6 py-12 lg:px-8">
                <h4>Login to Chronocal</h4>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm text-black dark:text-white">
                    <form className="space-y-6 border p-4 rounded-md border-black dark:border-white" onSubmit={handleSubmit}>
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
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="ml-2 text-sm text-blue-500"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                            Login
                        </button>
                    </form>
                </div>
                <h4>Don't have an account? <a href="/registration" className="text-blue-500">Register</a></h4>
            </div>
        </main>
    );
}