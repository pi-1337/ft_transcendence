import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";
import AnnouncementsClient from "./AnnouncementsClient";

export default async function AdminAnnouncementsPage() {
    const session = await getSession();

    if (!session)
        redirect('/auth/login');
    if (session.role !== 'ADMIN')
        redirect('/dashboard');

    const [organizations, announcements] = await Promise.all([
        prisma.organization.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            },
        }),
        prisma.announcement.findMany({
            select: {
                id: true,
                title: true,
                message: true,
                createdAt: true,
                updatedAt: true,
                organization: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                createdBy: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        }),
    ]);

    return <AnnouncementsClient organizations={organizations} announcements={announcements} />;
}
