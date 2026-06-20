'use server'

import { prisma } from "./prisma";

export async function sendNotification(userIds: number[], message: string) {
    await Promise.all(
        userIds.map(async (userId) => {
            await prisma.notification.create({
                data: {
                    message,
                    unreadUsers: { connect: { id: userId } }
                }
            });
        })
    );
}

export async function readNotification(userId: number, notifIds: number[]) {
    await Promise.all(
        notifIds.map(async (notifId) => {
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
        })
    );
}

export async function unreadNotification(userId: number, notifIds: number[]) {
    await Promise.all(
        notifIds.map(async (notifId) => {
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
                        readUsers: { disconnect: { id: userId } },
                        unreadUsers: { connect: { id: userId } }
                    }
                });
            }
        })
    );
}
