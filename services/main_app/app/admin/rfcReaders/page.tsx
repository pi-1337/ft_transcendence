import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";
import ReadersTable from "./ReadersTable";

export default async function AdminRfcReadersPage() {
    const session = await getSession();

    if (!session)
        redirect('/auth/login');
    if (session.role !== 'ADMIN')
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
