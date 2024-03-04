import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
export default function Login() {
    const router = useRouter();
    useEffect(() => {
        axios.get("http://localhost:8000/api/user")
            .then((response) => { 
                if (response.status === 200) {
                    router.push('/dashboard');
                }
            }).catch((err) => { });
    }, []);
    return (
        <main className="">
        </main>
    );
}