'use server'

import { getSession } from "@/lib/sessionManage";
import Client from "./client";

export default async function Home() {
    const sessionData = await getSession();

    if (!sessionData)
        return "not logged in";

    return (
        <>
            <Client userId={sessionData.id} />
        </>
    );
}
