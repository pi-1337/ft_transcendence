'use server'

import { getSession } from "@/lib/sessionManage";
import { redirect } from "next/navigation";
import BadgeRecordClient from "./client";

export default async function BadgeRecordPage({ params }: { params: { id: number } }) {
    const sessionData = await getSession();

    if (!sessionData) {
        redirect('/auth/login');
    }

    return <BadgeRecordClient organizationId={params.id} userId={sessionData.id} />;
}
