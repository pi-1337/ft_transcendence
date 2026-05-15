'use server'

import { getSession } from "@/lib/sessionManage";
import Client from "./client";

export default async function Home() {
    const userId = await getSession();

    if (!userId)
        return "not logged in";

    return (
        <>
        <Client userId={userId.toString()} />
        </>
    );
}
