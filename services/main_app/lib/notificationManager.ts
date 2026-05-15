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
        await prisma.notification.update({
            where: { id: notifId },
            data: {
                readUsers: { connect: { id: userId } },
                unreadUsers: { disconnect: { id: userId } }
            }
        });
    });
}
