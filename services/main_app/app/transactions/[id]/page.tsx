'use server'

import { getSession } from "@/lib/sessionManage";
import { redirect } from "next/navigation";
import Client from "./client";

export default async function TransactionDetailPage({ params }: { params: { id: string } }) {
    const id = await getSession();

    if (!id) {
        redirect('/auth/login');
    }

    return <Client transactionId={params.id} userId={id} />;
}
