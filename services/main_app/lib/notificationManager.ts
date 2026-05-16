'use server'

import { prisma } from "./prisma";

export async function sendNotification(userIds: number[], message: string) {
    userIds.forEach(async userId => {
        await prisma.notification.create({
            data: {
                message,
                unreadUsers: { connect: { id: userId } }
            }
        });
    });
}

export async function readNotification(userId: number, notifIds: number[]) {
    notifIds.forEach(async notifId => {
        const can_see_notification = await prisma.notification.count({
            where: {
                id: notifId,
                OR: [
                    { unreadUsers: { some: { id: userId } } },
                    { readUsers: { some: { id: userId } } }
                ]
            }
        });
        if (can_see_notification > 0) {
            await prisma.notification.update({
                where: { id: notifId },
                data: {
                    readUsers: { connect: { id: userId } },
                    unreadUsers: { disconnect: { id: userId } }
                }
            });
        }
    });
}
