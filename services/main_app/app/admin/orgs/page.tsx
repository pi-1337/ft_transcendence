import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";
import OrgsTable from "./OrgsTable";

export default async function AdminOrgsPage() {
    const userId = await getSession();

    if (!userId)
        redirect('/auth/login');

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
    });

    if (!user || user.role !== 'ADMIN')
        redirect('/dashboard');

    const orgs = await prisma.organization.findMany({
        select: {
            id: true,
            name: true,
            type: true,
            service: true,
            active: true,
            admin: { select: { id: true, firstname: true, lastname: true } },
            _count: { select: { users: true } },
            createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
    });

    return <OrgsTable orgs={orgs} />;
}
