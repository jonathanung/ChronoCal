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
            const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS) || 10);
            const hashedPassword = bcrypt.hashSync(user.password, salt);
            const response = await fetch(`${process.env.API_URL}/api/register`, {
                method: "post",
                mode: "cors",
                headers: {"Content-Type": "application/json"}, 
                body: JSON.stringify({
                    "firstName": user.firstName,
                    "lastName": user.lastName,
                    "email": user.email,
                    "passwordHash": hashedPassword
                })
            }); 
            console.log(await response.json());
        } catch (error) {
            console.error('Invalid', error);
        }
    };
    const router = useRouter();
    useEffect(() => {
        axios.get(`${process.env.APIURL}/api/user`)
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
                            <label htmlFor="firstName">First Name:</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={user.firstName}
                                onChange={handleChange}
                                className="mt-1 block w-full border p-2 rounded-md text-black"
                            />
                        </div>
                        <div>
                            <label htmlFor="email">Last Name:</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={user.lastName}
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