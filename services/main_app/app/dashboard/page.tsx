'use server'

import { getSession } from "@/lib/sessionManage";
import Client from "./client";

export default async function Home() {
    const data = await getSession();


    if (!data)
        return "not logged in";

    return (
        <>
            <Client userId={data.role} />
        </>
    );
}