import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";
import CreateReaderForm from "./CreateReaderForm";

export default async function CreateReaderPage() {
    const userId = await getSession();

    if (!userId)
        redirect('/auth/login');

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
    });

    if (!user || user.role !== 'ADMIN')
        redirect('/dashboard');

    const organizations = await prisma.organization.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
    });

    return <CreateReaderForm organizations={organizations} />;
}
