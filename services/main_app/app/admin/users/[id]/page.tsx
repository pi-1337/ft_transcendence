import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";
import EditUserForm from "./EditUserForm";

type Params = { params: Promise<{ id: string }> };

export default async function EditUserPage({ params }: Params) {
    const session = await getSession();

    if (!session)
        redirect('/auth/login');
    if (session.role !== 'ADMIN')
        redirect('/dashboard');

    const { id: rawId } = await params;
    const userId = parseInt(rawId);
    if (isNaN(userId))
        redirect('/admin/users');
    
    // add try catch block to protect the app from craching
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            phoneNumber: true,
            role: true,
            badge: { select: { number: true, createdAt: true } },
        },
    });

    if (!user)
        redirect('/admin/users');

    const userForForm = {
        ...user,
        phoneNumber: user.phoneNumber ?? '',
    };

    return <EditUserForm user={userForForm} isSelf={userId === session.id} />;
}
