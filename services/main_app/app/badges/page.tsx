'use server'

import { getSession } from "@/lib/sessionManage";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Client from "./client";

export default async function BadgesPage() {
    const session = await getSession();

    if (!session)
        redirect('/auth/login');

    const badge = await prisma.badge.findUnique({
        where: { userId: session },
        select: {
            number: true,
            org: { select: { id: true, name: true } },
            createdAt: true,
        }
    });

    return <Client badge={badge} />;
}
