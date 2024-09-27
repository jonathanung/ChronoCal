"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "../components/navbar";
import { CalendarIcon, DollarSignIcon, ListIcon } from "../functions/icons";
export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/current`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status !== 200) {
          router.push("/");
        } else {
          setUser(response.data);
        }
      })
      .catch((err) => {
        router.push("/");
      });
  }, []);
  return (
    <main className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 min-h-screen">
      <Navbar isLoggedIn={true} />
      <div className="w-full py-12 flex justify-center">
        <div className="container grid gap-6 px-4 md:px-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-black">
              {user ? (user.firstName ? `Welcome to your ChronoCal, ${user.firstName}.` : "Welcome to ChronoCal") : "Welcome to ChronoCal"}
            </h1>
            <p className="text-black md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-center">
              Click on a pane to begin organizing your life.
            </p>
          </div>
          <div className="grid gap-6 md:gap-4">
            <Link
              className="flex flex-col h-[200px] items-center p-4 rounded-xl bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 justify-center transition-colors hover:scale-105 hover:shadow-lg flex-1"
              href="/calendar"
            >
              <div className="inline-flex items-center gap-2 text-black">
                <CalendarIcon />
                <span className="font-medium">Calendar</span>
              </div>
              <p className="text-xs leading-none mt-1/2 text-black">
                Schedule your day
              </p>
            </Link>
            <Link
              className="flex flex-col h-[200px] items-center p-4 rounded-xl bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 justify-center transition-colors hover:scale-105 hover:shadow-lg flex-1"
              href="/expenses"
            >
              <div className="inline-flex items-center gap-2 text-black">
                <DollarSignIcon />
                <span className="font-medium">Expenses</span>
              </div>
              <p className="text-xs leading-none mt-1/2 text-black">
                Track your spending
              </p>
            </Link>
            <Link
              className="flex flex-col h-[200px] items-center p-4 rounded-xl bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 justify-center transition-colors hover:scale-105 hover:shadow-lg flex-1"
              href="/todo-list"
            >
              <div className="inline-flex items-center gap-2 text-black">
                <ListIcon />
                <span className="font-medium">Todo List</span>
              </div>
              <p className="text-xs leading-none mt-1/2 text-black">
                Get things done
              </p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
