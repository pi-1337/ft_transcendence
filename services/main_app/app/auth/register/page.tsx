"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      const response = await fetch('/api/auth/register', {
        method: "POST",
        body: JSON.stringify({ email, password, firstname, lastname, phoneNumber })
      })

      if (!response.ok) {
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
        type="password"
        onChange={(e) => { setPassword(e.target.value) }}
        value={password}
        required />
      <input
        placeholder="firstname"
        onChange={(e) => { setFirstname(e.target.value) }}
        value={firstname}
        required />
      <input
        placeholder="lastname"
        onChange={(e) => { setLastname(e.target.value) }}
        value={lastname}
        required />
      <input
        placeholder="phone number"
        onChange={(e) => { setPhoneNumber(e.target.value) }}
        value={phoneNumber}
        required />
      <button onClick={handleSubmit} >submit</button>
    </>
  );
}
