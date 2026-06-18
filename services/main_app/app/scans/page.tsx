// app/scans/page.tsx
import { prisma } from '@/lib/prisma';
import ScansClient from './ScansClient';
import { RequestStatus } from '@prisma/client';
import { getSession } from '@/lib/sessionManage';
import { redirect } from 'next/navigation';

// Notice the 'async' keyword. This is a Server Component.
export default async function PublicScansPage() {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN')
        redirect('/dashboard');

    // 1. Query the database directly from the page
    const recentScans = await prisma.zoomBadgeScan.findMany({
        orderBy: {
            timestampUtc: 'desc', // Get the newest scans first
        },
        take: 5, // Only grab the last 10 scans
        select: {
            // SECURITY: We only select the fields we want the public to see.
            // We intentionally leave out 'badgeId' so it is never sent to the browser!
            id: true,
            timestampUtc: true,
            status: true,
            badgeId: true,
        }
    });

    const pendingScan = await prisma.zoomBadgeScan.findFirst({
        where: {
            status: RequestStatus.PENDING
        }
    });


    // 2. Render the HTML
     return (
        <ScansClient
            recentScans={recentScans}
            pendingScanId={pendingScan?.id ?? null}
        />
    );
    
}
