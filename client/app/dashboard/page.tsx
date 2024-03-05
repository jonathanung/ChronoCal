"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../components/navbar';
export default function Dashboard() {
    const router = useRouter();
    // useEffect(() => {
    //     axios.get(`${process.env.API_URL}/api/user`)
    //         .then((response) => { 
    //             if (response.status !== 200) {
    //                 router.push('/');
    //             }
    //         }).catch((err) => { 
    //             router.push('/');
    //         });
    // }, []);
    return (
        <main className="">
            <Navbar isLoggedIn={true} />
        </main>
    );
}