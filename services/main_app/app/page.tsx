'use server'

import { getSession } from "@/lib/sessionManage";
import { redirect } from "next/navigation";
import LandingPageClient from "@/components/LandingPageClient";

export default async function Home() {
    const sessionData = await getSession();

    if (sessionData) {
        redirect('/dashboard');
    }

    return <LandingPageClient />;
}
