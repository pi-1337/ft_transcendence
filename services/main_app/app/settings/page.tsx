'use server'

import { getSession } from "@/lib/sessionManage";
import { redirect } from "next/navigation";
import Client from "./client";

export default async function UserEditPage() {
    const sessionData = await getSession();

    if (!sessionData) {
        redirect('/auth/login');
    }
    const { id } = sessionData;

    return <Client userId={id} />;
}
