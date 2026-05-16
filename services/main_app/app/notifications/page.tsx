

import { getSession } from "@/lib/sessionManage";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Notification } from "@prisma/client";
import Notifications from "./client";

export default async function ServerSide() {
    const session = await getSession();

    if (!session)
        redirect('/auth/login');

    if (session.role === 'ADMIN')
        redirect('/admin/dashboard');

    const { id } = session;
    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user)
        redirect('/auth/login');

    const unreadNotifications: Notification[] = await prisma.notification.findMany({
        where: {
            unreadUsers: { some: { id } }
        }
    });
    const readNotifications: Notification[] = await prisma.notification.findMany({
        where: {
            readUsers: { some: { id } }
        }
    });

    const notifications = [
        ...unreadNotifications.map(n => ({ id: n.id, read: false, message: n.message, createdAt: n.createdAt })),
        ...readNotifications.map(n => ({ id: n.id, read:  true, message: n.message, createdAt: n.createdAt }))
    ];

    return (
        <Notifications
            notifications={notifications}
        />
    );
}
