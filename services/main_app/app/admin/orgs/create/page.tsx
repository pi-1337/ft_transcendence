import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";
import CreateOrgForm from "./CreateOrgForm";

export default async function CreateOrgPage() {
    const userId = await getSession();

    if (!userId)
        redirect('/auth/login');

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
    });

    if (!user || user.role !== 'ADMIN')
        redirect('/dashboard');

    return <CreateOrgForm />;
}
