'use server'

import { getSession } from "@/lib/sessionManage";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Client from "./client";

export default async function UserDashboardPage() {
    const session = await getSession();

    if (!session)
        redirect('/auth/login');

    const user = await prisma.user.findUnique({
        where: { id: session },
        select: {
            firstname: true,
            lastname: true,
            email: true,
            badge: { select: { number: true } },
            orgs: { select: { id: true, name: true } },
        }
    });

    if (!user)
        redirect('/auth/login');

    return <Client user={user} />;
}
