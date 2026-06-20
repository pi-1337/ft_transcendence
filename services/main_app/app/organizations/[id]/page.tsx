import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/sessionManage';
import { redirect } from 'next/navigation';
import OrgDetails from './client';

export default async function ServerSide() {
    const session = await getSession();

    if (!session)
        redirect('/auth/login');

    const { id } = session;

    try {
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user)
            redirect('/auth/login');
        
        const orgs = await prisma.organization.findMany({
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
                admins: {
                    where: { id },
                    select: { id: true },
                },
            }
        });

        const formattedOrgs = await Promise.all(
            orgs.map(async (o: (typeof orgs)[number]) => ({
                id: o.id,
                name: o.name,
                type: o.type,
                service: o.service,
                badgeTimes: o.badgeTimes,
                active: o.active,
                createdAt: o.createdAt,
                members: await prisma.user.count({ where: { orgs: { some: { id: o.id } } } }) as number,
                badges: await prisma.badge.count({ where: { user: { orgs: { some: { id: o.id } } } } }) as number,
                isOrgAdmin: o.admins.length > 0,
            }))
        );

        return (
            <OrgDetails
                orgs={formattedOrgs}
            />
        );
    }
    catch (error) {
        if ((error as any)?.digest?.startsWith('NEXT_REDIRECT')) throw error;
        console.error('Failed to load organizations:', error);
        redirect('/dashboard');
    }
}
