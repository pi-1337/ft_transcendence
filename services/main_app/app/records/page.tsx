'use server'

import { getSession } from "@/lib/sessionManage";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Client from "./client";

export default async function RecordsPage() {
    const session = await getSession();

    if (!session)
        redirect('/auth/login');

    const records = await prisma.badgeTX.findMany({
        where: {
            badge: { userId: session }
        },
        select: {
            id: true,
            badge: { select: { number: true, org: { select: { name: true } } } },
            createdAt: true,
        },
        orderBy: { createdAt: 'desc' }
    });

    return <Client records={records} />;
}
