import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/sessionManage";
import { redirect } from "next/navigation";
import Settings from "./client";

export default async function ServerSide() {
    const session = await getSession();

    if (!session)
        redirect('/auth/login');

    if (session.role === 'ADMIN')
        redirect('/admin/dashboard');

    const { id } = session;
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            phoneNumber: true,
            role: true,
            avatar: true
        }
    });

    if (!user)
        redirect('/auth/login');

    return (
        <Settings
            user={user}
        />
    );
}
