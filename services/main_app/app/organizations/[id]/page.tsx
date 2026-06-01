import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/sessionManage';
import { redirect } from 'next/navigation';
import OrgDetails from './client';
import { Organization } from '@prisma/client';

export default async function ServerSide() {
    const session = await getSession();

    if (!session)
        redirect('/auth/login');

    if (session.role === 'ADMIN')
        redirect('/admin/dashboard');

    const { id } = session;
    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user)
        redirect('/auth/login');

    let orgs: Organization[] = await prisma.organization.findMany({
        where: {
            users: { some: { id } }
        },
        select: {
            id: true,
            name: true,
            type: true,
            service: true,
            badgeTimes: true,
            active: true,
            createdAt: true,
            // members: true,
            // badges: true,
            // description: true,
        }
    });

    const formattedOrgs = await Promise.all(
        orgs.map(async o => ({
            id: o.id,
            name: o.name,
            type: o.type,
            service: o.service,
            badgeTimes: o.badgeTimes,
            active: o.active,
            createdAt: o.createdAt,
            members: await prisma.user.count({ where: { orgs: { some: { id: o.id } } } }) as number,
            badges: await prisma.badge.count({ where: { orgId: o.id } }) as number,
        }))
    );

    return (
        <OrgDetails
            orgs={formattedOrgs}
        />
    );
}
