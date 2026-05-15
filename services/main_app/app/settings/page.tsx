'use server'

import { getSession } from "@/lib/sessionManage";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Client from "./client";

export default async function SettingsPage() {
    const userId = await getSession();

    if (!userId) {
        redirect('/auth/login');
    }

    return <Client userId={userId.toString()} />;
}
