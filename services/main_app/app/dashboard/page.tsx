'use server'

import { getSession } from "@/lib/sessionManage";
import Dashboard from "./client";

export default async function Home() {
    const id = await getSession();


    if (!id)
        return "not logged in";

    return (
        <>
        <Dashboard />
        </>
    );
}
