"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {

            const response = await fetch('/api/auth/login', {
                method: "POST",
                body: JSON.stringify({email, password})
            })

            if (!response.ok)
            {
                console.log("error occured");
                return;
            }

            const data = await response.json();

            console.log(data);

        } catch (error) {
            console.log("error occured");
            console.log(error);
        }
    }

    return (
        <>
            <input
                placeholder="email"
                onChange={(e) => { setEmail(e.target.value) }}
                value={email}
                required />
            <input
                placeholder="password"
                onChange={(e) => { setPassword(e.target.value) }}
                value={password}
                required />
            <button onClick={handleSubmit} >submit</button>
        </>
    );
}
