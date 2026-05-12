'use server'

import { getSession } from "@/lib/sessionManage";
import { redirect } from "next/navigation";

export default async function Home() {
    const id = await getSession();

    if (!id) {
        redirect('/auth/login');
    }

    redirect('/user/dashboard');
}
