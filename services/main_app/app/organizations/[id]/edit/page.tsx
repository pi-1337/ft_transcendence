import { redirect } from 'next/navigation';
import { getSession } from '@/lib/sessionManage';
import { prisma } from '@/lib/prisma';
import EditOrgForm from '../../../admin/orgs/[id]/EditOrgForm';

type Params = { params: Promise<{ id: string }> };

export default async function OrgAdminEditPage({ params }: Params) {
    const session = await getSession();

    if (!session)
        redirect('/auth/login');

    const { id: rawId } = await params;
    const orgId = parseInt(rawId, 10);
    if (isNaN(orgId))
        redirect('/organizations');

    const org = await prisma.organization.findFirst({
        where: {
            id: orgId,
            users: { some: { id: session.id } },
            admins: { some: { id: session.id } },
        },
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
        redirect(`/organizations/${orgId}`);

    return (
        <EditOrgForm
            org={org}
            config={{
                backHref: `/organizations/${orgId}`,
                backLabel: org.name,
                title: 'Edit organization',
                saveFieldsUrl: '/api/organization/edit',
                addMemberUrl: '/api/organization/addUser',
                removeMemberUrl: '/api/organization/removeUser',
                mealsUrl: '/api/organization/meals',
                showAdminSection: false,
                blockAdminMemberRemoval: true,
            }}
        />
    );
}