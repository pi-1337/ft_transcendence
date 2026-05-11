import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";
import OrgsTable from "./OrgsTable";

export default async function AdminOrgsPage() {
    const session = await getSession();

    if (!session)
        redirect('/auth/login');
    if (session.role !== 'ADMIN')
        redirect('/dashboard');

    const orgs = await prisma.organization.findMany({
        select: {
            id: true,
            name: true,
            type: true,
            service: true,
            active: true,
            admins: { select: { id: true, firstname: true, lastname: true } },
            _count: { select: { users: true } },
            createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
    });

    return <OrgsTable orgs={orgs} />;
}
