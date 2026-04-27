
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            
            const response = await fetch('/api/auth/login')


        } catch (error) {
            console.log("error occured");
            console.log(error);
        }
    }

    return (
        <div className="">
            <input placeholder="email" onChange={(e) => { setEmail(e.target.value) }} >{email}</input>
            <input placeholder="password" onChange={(e) => { setPassword(e.target.value) }} >{password}</input>
        </div>
    );
}
