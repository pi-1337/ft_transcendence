import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RequestStatus, Active } from '@prisma/client';

export async function POST(request: Request) {
    try
    {
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.SCANNER_API_KEY}`)
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();

        const badge = await prisma.badge.findUnique({
            where: { number: body.badge_id }
        });
        if (!badge)
            return NextResponse.json({ error: 'Badge not registered' }, { status: 404 });

        const rfReader = await prisma.rfidReaders.findUnique({
            where: { id: parseInt(body.reader_id, 10) }
        });
        if (!rfReader)
            return NextResponse.json({ error: 'rfReader not registered' }, { status: 404 });

        const organization = await prisma.organization.findFirst({
            where: {
                id: rfReader.organizationId,
                users: { some: { id: badge.userId } }
            },
            include: { meals: true }
        });
        if (!organization)
            return NextResponse.json({ error: 'User not in this organization' }, { status: 403 });
        if (organization.active === Active.FALSE)
            return NextResponse.json({ error: 'Organization is not active' }, { status: 403 });

        const pendingRequestsCount = await prisma.badgeScan.count({
            where: {
                status: RequestStatus.PENDING,
                rfidReader: { organizationId: rfReader.organizationId }
            }
        });
        if (pendingRequestsCount >= 5)
            return NextResponse.json({ error: "Gate is currently processing a request" }, { status: 409 });

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const activeMeal = organization.meals.find(meal => {
            const start = new Date(meal.startTime);
            const end = new Date(meal.endTime);
            const startMinutes = start.getHours() * 60 + start.getMinutes();
            const endMinutes = end.getHours() * 60 + end.getMinutes();
            return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
        });

        if (!activeMeal)
            return NextResponse.json({ error: 'No active meal window' }, { status: 403 });

        const userPendingCount = await prisma.badgeScan.count({
            where: {
                status: RequestStatus.PENDING,
                rfidReader: { organizationId: rfReader.organizationId },
                badgeId: badge.number
            }
        });
        if (userPendingCount >= 1)
            return NextResponse.json({ error: "Server is currently processing this user's request" }, { status: 409 });
        
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const userAcceptedCount = await prisma.badgeScan.count({
            where: {
                status: RequestStatus.ACCEPTED,
                rfidReader: { organizationId: rfReader.organizationId },
                badgeId: badge.number,
                mealId: activeMeal.id,
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay,
                }
            }
        });

        const autoReject = userAcceptedCount >= organization.badgeTimes;

        await prisma.badgeScan.create({
            data: {
                badgeId: badge.number,
                rfidReaderID: rfReader.id,
                mealId: activeMeal.id,
                status: autoReject ? RequestStatus.REJECTED : RequestStatus.PENDING
            }
        });

        return NextResponse.json({ success: true }, { status: 201 });

    }
    catch (error)
    {
        console.error("Database Insert Error:", error);
        return NextResponse.json({ error: "Failed to save scan" }, { status: 500 });
    }
}
