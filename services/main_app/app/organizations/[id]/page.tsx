'use server'

import { getSession } from "@/lib/sessionManage";
import { redirect } from "next/navigation";
import Client from "./client";

export default async function OrganizationPage({ params }: { params: { id: string } }) {
    const id = await getSession();

    if (!id) {
        redirect('/auth/login');
    }

    return <Client orgId={params.id} userId={id} />;
}
