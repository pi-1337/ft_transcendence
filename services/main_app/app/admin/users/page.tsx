import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";
import UsersTable from "./UsersTable";

export default async function AdminUsersPage() {
    const session = await getSession();

    if (!session)
        redirect('/auth/login');
    if (session.role !== 'ADMIN')
        redirect('/dashboard');

    const rows = await prisma.user.findMany({
        select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            role: true,
            createdAt: true,
            phoneNumber: true,
            orgs: { select: { id: true }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
    });

    const users = rows.map(({ orgs, ...user }) => ({ ...user, orgId: orgs[0]?.id ?? null }));

    return <UsersTable users={users} currentAdminId={session.id} />;
}
