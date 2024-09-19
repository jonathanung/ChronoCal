"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from './components/navbar';
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, DollarSign, FileText, LineChart, Mic, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
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
        <Navbar isLoggedIn={false} />
       <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 to-white">
        <main className="flex-1">
            <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col items-center space-y-4 text-center">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Chronocal
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    A way to chronologize your life
                </p>
                <div className="space-x-4">
                    <Button>Get Started</Button>
                    <Button variant="outline">Learn More</Button>
                </div>
                </div>
            </div>
            </section>
            <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
            <div className="container px-4 md:px-6 mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
                Features
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch max-w-5xl mx-auto">
                <Card>
                    <CardHeader>
                    <CardTitle>Smart Calendar</CardTitle>
                    <CardDescription>Generate unique calendars with AI-powered task creation</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <Image
                        src="/placeholder.svg?height=100&width=200"
                        width={200}
                        height={100}
                        alt="Calendar"
                        className="w-full object-cover"
                    />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                    <CardTitle>Expense Tracking</CardTitle>
                    <CardDescription>Visualize and analyze your spending habits</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <Image
                        src="/placeholder.svg?height=100&width=200"
                        width={200}
                        height={100}
                        alt="Expense Graph"
                        className="w-full object-cover"
                    />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                    <CardTitle>Todo List</CardTitle>
                    <CardDescription>Manage tasks with interactive sticky notes</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <Image
                        src="/placeholder.svg?height=100&width=200"
                        width={200}
                        height={100}
                        alt="Todo List"
                        className="w-full object-cover"
                    />
                    </CardContent>
                </Card>
                </div>
            </div>
            </section>
            <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6 mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
                More Amazing Features
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-start max-w-5xl mx-auto">
                <div className="flex flex-col items-center text-center">
                    <FileText className="h-12 w-12 mb-4 text-blue-500" />
                    <h3 className="text-lg font-bold">ICS File Support</h3>
                    <p className="text-sm text-gray-500">Import and export calendar data with ease</p>
                </div>
                <div className="flex flex-col items-center text-center">
                    <Sun className="h-12 w-12 mb-4 text-yellow-500" />
                    <h3 className="text-lg font-bold">Weather Widget</h3>
                    <p className="text-sm text-gray-500">Stay informed about the weather conditions</p>
                </div>
                <div className="flex flex-col items-center text-center">
                    <LineChart className="h-12 w-12 mb-4 text-green-500" />
                    <h3 className="text-lg font-bold">Expense Analytics</h3>
                    <p className="text-sm text-gray-500">Compare spending on a monthly and weekly basis</p>
                </div>
                <div className="flex flex-col items-center text-center">
                    <Mic className="h-12 w-12 mb-4 text-purple-500" />
                    <h3 className="text-lg font-bold">Speech to Text</h3>
                    <p className="text-sm text-gray-500">Create tasks and events using voice commands</p>
                </div>
                </div>
            </div>
            </section>
        </main>
        <footer className="w-full py-6 border-t">
            <div className="container px-4 md:px-6 mx-auto flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Chronocal. All rights reserved.</p>
            <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
                <Link className="text-xs hover:underline underline-offset-4" href="#">
                Terms of Service
                </Link>
                <Link className="text-xs hover:underline underline-offset-4" href="#">
                Privacy
                </Link>
            </nav>
            </div>
        </footer>
        </div>
      </main>
    );
}

