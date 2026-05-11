'use server'

import { getSession } from "@/lib/sessionManage";
import LeaderboardClient from "./client";

export default async function Page() {
    const id = await getSession();

    if (!id)
        return "not logged in";

    return <LeaderboardClient />;
}
