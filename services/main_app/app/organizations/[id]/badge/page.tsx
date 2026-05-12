'use server'

import { getSession } from "@/lib/sessionManage";
import { redirect } from "next/navigation";
import AwardBadgeClient from "./client";

export default async function AwardBadgePage({ params }: { params: { id: number } }) {
    const userId = await getSession();

    if (!userId) {
        redirect('/auth/login');
    }

    return <AwardBadgeClient orgId={params.id} />;
}
