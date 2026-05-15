import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";
import EditOrgForm from "./EditOrgForm";

type Params = { params: Promise<{ id: string }> };

export default async function EditOrgPage({ params }: Params) {
    const userId = await getSession();

    if (!userId)
        redirect('/auth/login');

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
    });

    if (!user || user.role !== 'ADMIN')
        redirect('/dashboard');

    const { id: rawId } = await params;
    const orgId = parseInt(rawId);
    if (isNaN(orgId))
        redirect('/admin/orgs');

    const org = await prisma.organization.findUnique({
        where: { id: orgId },
        include: {
            users: { select: { id: true, firstname: true, lastname: true, email: true } },
            admin: { select: { id: true, firstname: true, lastname: true, email: true } },
        },
    });

    if (!org)
        redirect('/admin/orgs');

    return <EditOrgForm org={org} />;
}
