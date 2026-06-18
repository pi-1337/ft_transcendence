import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";
import EditOrgForm from "./EditOrgForm";

type Params = { params: Promise<{ id: string }> };

export default async function EditOrgPage({ params }: Params) {
    const session = await getSession();

    if (!session)
        redirect('/auth/login');
    if (session.role !== 'ADMIN')
        redirect('/dashboard');

    const { id: rawId } = await params;
    const orgId = parseInt(rawId);
    if (isNaN(orgId))
        redirect('/admin/orgs');

    const org = await prisma.organization.findUnique({
        where: { id: orgId },
        include: {
            users: { select: { id: true, firstname: true, lastname: true, email: true } },
            admins: { select: { id: true, firstname: true, lastname: true, email: true } },
            meals: {
                select: { id: true, name: true, startTime: true, endTime: true },
                orderBy: { startTime: 'asc' },
            },
        },
    });

    if (!org)
        redirect('/admin/orgs');

    return <EditOrgForm org={org} />;
}
