"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Logout() {
    const router = useRouter();
    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/logout`, { withCredentials: true })
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    router.push("/");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    return (
        <main className="">
            <h3>Logging out...</h3>
        </main>
    );
}