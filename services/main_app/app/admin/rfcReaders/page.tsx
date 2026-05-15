import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";
import ReadersTable from "./ReadersTable";

export default async function AdminRfcReadersPage() {
    const userId = await getSession();

    if (!userId)
        redirect('/auth/login');

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
    });

    if (!user || user.role !== 'ADMIN')
        redirect('/dashboard');

    const readers = await prisma.rfidReaders.findMany({
        select: {
            id: true,
            location: true,
            organizationId: true,
            organization: { select: { name: true } },
        },
        orderBy: { id: 'desc' },
    });

    return <ReadersTable readers={readers} />;
}
