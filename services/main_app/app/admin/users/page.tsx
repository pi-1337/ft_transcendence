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

    const users = await prisma.user.findMany({
        select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            role: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
    });

    return <UsersTable users={users} currentAdminId={session.id} />;
}
