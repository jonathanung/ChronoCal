"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
export default function Calendar() {
    const router = useRouter();
    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/current`, { withCredentials: true })
            .then((response) => { 
                if (response.status !== 200) {
                    router.push('/');
                } else {
                    
                }
            }).catch((err) => { 
                router.push('/');
            });
    }, []);
    return (
        <div>
            <p>Calendar</p>
        </div>
    )
}