import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";
import EditUserForm from "./EditUserForm";

type Params = { params: Promise<{ id: string }> };

export default async function EditUserPage({ params }: Params) {
    const adminId = await getSession();

    if (!adminId)
        redirect('/auth/login');

    const adminUser = await prisma.user.findUnique({
        where: { id: adminId },
        select: { role: true }
    });

    if (!adminUser || adminUser.role !== 'ADMIN')
        redirect('/dashboard');

    const { id: rawId } = await params;
    const userId = parseInt(rawId);
    if (isNaN(userId))
        redirect('/admin/users');

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, firstname: true, lastname: true, email: true, phoneNumber: true, role: true },
    });

    if (!user)
        redirect('/admin/users');

    return <EditUserForm user={user} isSelf={userId === adminId} />;
}
