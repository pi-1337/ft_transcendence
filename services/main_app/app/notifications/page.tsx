'use server'

import { getSession } from "@/lib/sessionManage";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Client from "./client";

export default async function NotificationsPage() {
    const userId = await getSession();

    if (!userId) {
        redirect('/auth/login');
    }

    const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });

    return <Client notifications={notifications} />;
}
