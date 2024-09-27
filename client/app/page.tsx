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
      <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <Navbar isLoggedIn={false} />
        <div className="flex flex-col min-h-screen">
        <main className="flex-1">
            <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col items-center space-y-4 text-center">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                    Chronocal
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl dark:text-gray-300">
                    A way to chronologize your life
                </p>
                <div className="space-x-4">
                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white">Get Started</Button>
                    <Button variant="outline" className="border-indigo-500 text-indigo-500 hover:bg-indigo-50">Learn More</Button>
                </div>
                </div>
            </div>
            </section>
            <section className="w-full py-12 md:py-24 lg:py-32 bg-white/50 backdrop-blur-sm">
            <div className="container px-4 md:px-6 mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                Features
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch max-w-5xl mx-auto">
                <Card className="bg-white/70 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                    <CardTitle className="text-indigo-600">Smart Calendar</CardTitle>
                    <CardDescription>Generate unique calendars with AI-powered task creation</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <Image
                        src="/placeholder.svg?height=100&width=200"
                        width={200}
                        height={100}
                        alt="Calendar"
                        className="w-full object-cover rounded-md"
                    />
                    </CardContent>
                </Card>
                <Card className="bg-white/70 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                    <CardTitle className="text-purple-600">Expense Tracking</CardTitle>
                    <CardDescription>Visualize and analyze your spending habits</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <Image
                        src="/placeholder.svg?height=100&width=200"
                        width={200}
                        height={100}
                        alt="Expense Graph"
                        className="w-full object-cover rounded-md"
                    />
                    </CardContent>
                </Card>
                <Card className="bg-white/70 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                    <CardTitle className="text-pink-600">Todo List</CardTitle>
                    <CardDescription>Manage tasks with interactive sticky notes</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <Image
                        src="/placeholder.svg?height=100&width=200"
                        width={200}
                        height={100}
                        alt="Todo List"
                        className="w-full object-cover rounded-md"
                    />
                    </CardContent>
                </Card>
                </div>
            </div>
            </section>
            <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6 mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                More Amazing Features
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-start max-w-5xl mx-auto">
                <div className="flex flex-col items-center text-center p-4 bg-white/70 backdrop-blur-sm rounded-lg hover:shadow-lg transition-shadow duration-300">
                    <FileText className="h-12 w-12 mb-4 text-indigo-500" />
                    <h3 className="text-lg font-bold text-indigo-600">ICS File Support</h3>
                    <p className="text-sm text-gray-600">Import and export calendar data with ease</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-white/70 backdrop-blur-sm rounded-lg hover:shadow-lg transition-shadow duration-300">
                    <Sun className="h-12 w-12 mb-4 text-yellow-500" />
                    <h3 className="text-lg font-bold text-yellow-600">Weather Widget</h3>
                    <p className="text-sm text-gray-600">Stay informed about the weather conditions</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-white/70 backdrop-blur-sm rounded-lg hover:shadow-lg transition-shadow duration-300">
                    <LineChart className="h-12 w-12 mb-4 text-green-500" />
                    <h3 className="text-lg font-bold text-green-600">Expense Analytics</h3>
                    <p className="text-sm text-gray-600">Compare spending on a monthly and weekly basis</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-white/70 backdrop-blur-sm rounded-lg hover:shadow-lg transition-shadow duration-300">
                    <Mic className="h-12 w-12 mb-4 text-purple-500" />
                    <h3 className="text-lg font-bold text-purple-600">Speech to Text</h3>
                    <p className="text-sm text-gray-600">Create tasks and events using voice commands</p>
                </div>
                </div>
            </div>
            </section>
        </main>
        <footer className="w-full py-6 border-t bg-white/50 backdrop-blur-sm">
            <div className="container px-4 md:px-6 mx-auto flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xs text-gray-600 dark:text-gray-400">© 2024 Chronocal. All rights reserved.</p>
            <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
                <Link className="text-xs hover:underline underline-offset-4 text-indigo-600" href="#">
                Terms of Service
                </Link>
                <Link className="text-xs hover:underline underline-offset-4 text-indigo-600" href="#">
                Privacy
                </Link>
            </nav>
            </div>
        </footer>
        </div>
      </main>
    );
}
