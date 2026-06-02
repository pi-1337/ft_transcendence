import { prisma } from "@/lib/prisma";
import { Notification } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const unreadNotifications: Notification[] = await prisma.notification.findMany({
            where: {
                unreadUsers: { some: { id: parseInt((await params).id) } }
            }
        })

        const readNotifications: Notification[] = await prisma.notification.findMany({
            where: {
                readUsers: { some: { id: parseInt((await params).id) } }
            }
        })

        const notifications = [
            ...unreadNotifications.map(n => ({ id: n.id, read: false, message: n.message, createdAt: n.createdAt })),
            ...readNotifications.map(n => ({ id: n.id, read: true, message: n.message, createdAt: n.createdAt }))
        ];


        return NextResponse.json({
            success: true,
            data: {
                notifications
            }
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            data: null
        });
    }
}

