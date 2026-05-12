'use server'

import { getSession } from "@/lib/sessionManage";
import { redirect } from "next/navigation";
import Client from "./client";

export default async function OrganizationsPage() {
    const id = await getSession();

    if (!id) {
        redirect('/auth/login');
    }

    return <Client userId={id} />;
}
