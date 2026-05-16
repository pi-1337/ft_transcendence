import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/sessionManage';
import { redirect } from 'next/navigation';
import OrgDetails from './client';

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
            // members: true,
            // badges: true,
            // description: true,
        }
    })

    return (
        <OrgDetails
            orgs={orgs}
        />
    );
}
