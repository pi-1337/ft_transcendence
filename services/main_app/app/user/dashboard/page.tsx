'use server'

import { getSession } from "@/lib/sessionManage";
import Client from "./client";

export default async function Home() {
    const id = await getSession();


    if (!id)
        return "not logged in";

    return (
        <>
        <Client />
        </>
    );
}
