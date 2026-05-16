import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/sessionManage';
import { OrgsFrontend } from '@/lib/types';
import { redirect } from 'next/navigation';
import Organizations from './client';

export default async function ServerSide() {
    const session = await getSession();

    if (!session)
        redirect('/auth/login');

    if (session.role === 'ADMIN')
        redirect('/admin/dashboard');

    const { id } = session;
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            phoneNumber: true,
            role: true
        }
    });

    if (!user)
        redirect('/auth/login');

    const orgs: OrgsFrontend[] = await prisma.organization.findMany({
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
            createdAt: true
        }
    });

    return (
        <Organizations
            orgs={orgs}
        />
    );
}
