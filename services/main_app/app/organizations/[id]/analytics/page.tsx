import { redirect } from 'next/navigation';
import { getSession } from '@/lib/sessionManage';
import { prisma } from '@/lib/prisma';
import { RequestStatus } from '@prisma/client';
import StatisticsClient from './AnalyticsClient';

type Params = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ days?: string }>;
};

export default async function OrgScansPage({ params, searchParams }: Params) {
    const session = await getSession();
    if (!session) redirect('/auth/login');

    const { id: rawId } = await params;
    const orgId = parseInt(rawId, 10);
    if (isNaN(orgId)) redirect('/organizations');

    const org = await prisma.organization.findFirst({
        where: {
            id: orgId,
            admins: { some: { id: session.id } },
        },
        include: { meals: true }
    });
    if (!org) redirect(`/organizations/${orgId}`);
    
    const resolvedSearchParams = await searchParams;
    const daysString = resolvedSearchParams.days || "1";
    const parsed = parseInt(daysString, 10);
    const days = (!isNaN(parsed) && parsed >= 1 && parsed <= 60) ? parsed : 1;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const mealStats = await prisma.badgeScan.groupBy({
        by: ['mealId', 'status'],
        where: {
            rfidReader: { organizationId: orgId },
            createdAt: { gte: startDate },
        },
        _count: { _all: true },
    });

    const rawScans = await prisma.badgeScan.findMany({
        where: {
            rfidReader: { organizationId: orgId },
            createdAt: { gte: startDate },
        },
        select: {
            createdAt: true,
            status: true,
        }
    });

    const trendMap: Record<string, { date: string, accepted: number, rejected: number }> = {};
    
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateString = d.toISOString().split('T')[0];
        trendMap[dateString] = { date: dateString, accepted: 0, rejected: 0 };
    }

    for (const scan of rawScans) {
        const dateString = scan.createdAt.toISOString().split('T')[0];
        
        if (trendMap[dateString]) {
            if (scan.status === RequestStatus.ACCEPTED) trendMap[dateString].accepted++;
            if (scan.status === RequestStatus.REJECTED) trendMap[dateString].rejected++;
        }
    }

    const trendData = Object.values(trendMap);
    const analytics = {
        days,
        meals: org.meals.map(meal => {
            const accepted = mealStats.find(s => s.mealId === meal.id && s.status === RequestStatus.ACCEPTED)?._count._all ?? 0;
            const rejected = mealStats.find(s => s.mealId === meal.id && s.status === RequestStatus.REJECTED)?._count._all ?? 0;
            return { id: meal.id, name: meal.name, startTime: meal.startTime, endTime: meal.endTime, accepted, rejected };
        }),
        totalAccepted: mealStats.filter(s => s.status === RequestStatus.ACCEPTED).reduce((sum, s) => sum + s._count._all, 0),
        totalRejected: mealStats.filter(s => s.status === RequestStatus.REJECTED).reduce((sum, s) => sum + s._count._all, 0),
        trendData,
    };


    return (
        <StatisticsClient
            analytics={analytics}
            periodDays={days}
            orgID={orgId}
            orgName={org.name}
        />
    );
}
