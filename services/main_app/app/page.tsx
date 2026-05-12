'use server'

import { getSession } from "@/lib/sessionManage";
import { redirect } from "next/navigation";

export default async function Home() {
    const sessionData = await getSession();

    if (!sessionData) {
        redirect('/auth/login');
    }
    const { id } = sessionData;

    redirect('/user/dashboard');
}
