'use server'

import { getSession } from "@/lib/sessionManage";

export default async function Home() {
    const id = await getSession();


    if (!id)
        return "not logged in";

    return (
        <>
        </>
    );
}
