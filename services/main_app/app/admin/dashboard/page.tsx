import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";
import AdminDashboard from "./client";

export default async function AdminDashboardPage() {
    const userId = await getSession();

    if (!userId)
        redirect('/auth/login');

    const [admin, totalUsers, totalOrgs, totalReaders] = await Promise.all([
        prisma.user.findUnique({ 
            where: { id: userId }, 
            select: { role: true, firstname: true, lastname: true, email: true } 
        }),
        prisma.user.count(),
        prisma.organization.count(),
        prisma.rfidReaders.count(),
    ]);

    if (!admin || admin.role !== 'ADMIN')
        redirect('/auth/login');

    return (
        <AdminDashboard
            firstname={admin.firstname}
            lastname={admin.lastname}
            email={admin.email}
            totalUsers={totalUsers}
            totalOrgs={totalOrgs}
            totalReaders={totalReaders}
        />
    );
}
