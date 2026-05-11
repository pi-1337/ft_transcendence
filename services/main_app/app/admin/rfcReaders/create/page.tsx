import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";
import CreateReaderForm from "./CreateReaderForm";

export default async function CreateReaderPage() {
    const session = await getSession();

    if (!session)
        redirect('/auth/login');
    if (session.role !== 'ADMIN')
        redirect('/dashboard');

    const organizations = await prisma.organization.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
    });

    return <CreateReaderForm organizations={organizations} />;
}
