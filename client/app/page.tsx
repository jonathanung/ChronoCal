"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from './components/navbar';
export default function Home() {
    const router = useRouter();
    useEffect(() => {
        axios.get(`${process.env.API_URL}/api/user`)
            .then((response) => { 
                if (response.status === 200) {
                    router.push('/dashboard');
                }
            }).catch((err) => { });
    }, []);
  return (
      <main className="">
        <Navbar isLoggedIn={false} />
      </main>
    );
}