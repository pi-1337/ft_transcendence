'use server'

import { getSession } from "@/lib/sessionManage";
import SchemeClient from "./client";

export default async function Page() {
    const id = await getSession();

    if (!id)
        return "not logged in";

    return <SchemeClient />;
}
