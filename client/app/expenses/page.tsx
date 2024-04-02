"use client";
import React, { useEffect } from 'react';
import Navbar from '../components/navbar';
import { useRouter } from 'next/navigation';
import axios from 'axios';
export default function Expenses() {
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
            <p>Expenses</p>
        </main>
    )
}