import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";
import CreateUserForm from "./CreateUserForm";

export default async function CreateUserPage() {
    const userId = await getSession();

    if (!userId)
        redirect('/auth/login');

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
    });

    if (!user || user.role !== 'ADMIN')
        redirect('/dashboard');

    return <CreateUserForm />;
}
