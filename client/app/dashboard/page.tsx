"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../components/navbar';
import { CalendarIcon, DollarSignIcon, ListIcon } from '../functions/icons';
export default function Dashboard() {
    const router = useRouter();
    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/current`, { withCredentials: true })
            .then((response) => { 
                if (response.status !== 200) {
                    router.push('/');
                }
            }).catch((err) => { 
                router.push('/');
            });
    }, []);
    return (
        <main className="">
            <Navbar isLoggedIn={true} />
                <div className="w-full py-12 flex justify-center">
                    <div className="container grid gap-6 px-4 md:px-6">
                        <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Welcome to your Chronocal.</h1>
                        <p className=" text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 text-center">
                            Click on a pane to begin organizing your life.
                        </p>
                        </div>
                        <div className="grid gap-6 md:gap-4">
                        <Link
                            className="flex flex-col h-[200px] items-center p-4 rounded-xl border border-gray-200 dark:border-slate-400 justify-center transition-colors hover:scale-105 hover:shadow-lg flex-1"
                            href="/calendar"
                        >
                            <div className="inline-flex items-center gap-2">
                            <CalendarIcon />
                            <span className="font-medium">Calendar</span>
                            </div>
                            <p className="text-xs leading-none mt-1/2">Schedule your day</p>
                        </Link>
                        <Link
                            className="flex flex-col h-[200px] items-center p-4 rounded-xl border border-gray-200 dark:border-slate-400 justify-center transition-colors hover:scale-105 hover:shadow-lg flex-1"
                            href="/expenses"
                        >
                            <div className="inline-flex items-center gap-2">
                            <DollarSignIcon />
                            <span className="font-medium">Expenses</span>
                            </div>
                            <p className="text-xs leading-none mt-1/2">Track your spending</p>
                        </Link>
                        <Link
                            className="flex flex-col h-[200px] items-center p-4 rounded-xl border border-gray-200 dark:border-slate-400 justify-center transition-colors hover:scale-105 hover:shadow-lg flex-1"
                            href="/todo-list"
                        >
                            <div className="inline-flex items-center gap-2">
                            <ListIcon />
                            <span className="font-medium">Todo List</span>
                            </div>
                            <p className="text-xs leading-none mt-1/2">Get things done</p>
                        </Link>
                        </div>
                    </div>
                    </div>
        </main>
    );
}