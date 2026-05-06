import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";
import AdminDashboard from "./client";

export default async function AdminDashboardPage() {
    const session = await getSession();

    if (!session)
        redirect('/auth/login');

    if (session.role !== 'ADMIN')
        redirect('/dashboard');

    const { id } = session;

    const [admin, totalUsers, totalOrgs] = await Promise.all([
        prisma.user.findUnique({
            where: { id },
            select: { firstname: true, lastname: true, email: true },
        }),
        prisma.user.count(),
        prisma.organization.count(),
    ]);

    if (!admin)
        redirect('/auth/login');

    return (
        <AdminDashboard
            firstname={admin.firstname}
            lastname={admin.lastname}
            email={admin.email}
            totalUsers={totalUsers}
            totalOrgs={totalOrgs}
        />
    );
}
