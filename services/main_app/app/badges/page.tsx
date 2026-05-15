'use server'

import { getSession } from "@/lib/sessionManage";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Client from "./client";

export default async function BadgesPage() {
    const session = await getSession();

    if (!session)
        redirect('/auth/login');

    const badges = await prisma.badge.findMany({
        where: { userId: session },
        select: {
            number: true,
            org: { select: { id: true, name: true } },
            createdAt: true,
        },
        take: 1,
    });

    const badge = badges.length > 0 ? badges[0] : null;

    return <Client badge={badge} />;
}
