'use server'

import { getSession } from "@/lib/sessionManage";
import { redirect } from "next/navigation";
import Client from "./client";

export default async function AwardBadgePage({ params }: { params: { id: string } }) {
    const userId = await getSession();

    if (!userId) {
        redirect('/auth/login');
    }

    return <Client orgId={params.id} />;
}
