import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RequestStatus } from '@prisma/client';

function authorize(request: Request) {
    const scannerApiKey = process.env.SCANNER_API_KEY;
    if (!scannerApiKey)
        return NextResponse.json({ error: 'Server is not configured' }, { status: 500 });

    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${scannerApiKey}`)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    return null;
}

function parseId(id: string) {
    const scanId = Number.parseInt(id, 10);
    if (Number.isNaN(scanId) || scanId <= 0)
        return null;
    return scanId;
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const unauthorized = authorize(request);
        if (unauthorized)
            return unauthorized;

        const { id } = await params;
        const scanId = parseId(id);
        if (!scanId)
            return NextResponse.json({ error: 'Invalid scan id' }, { status: 400 });

        const body = await request.json();
        const decision = body?.decision as RequestStatus | undefined;
        if (!decision || ![RequestStatus.ACCEPTED, RequestStatus.REJECTED].includes(decision))
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

        const currentState = await prisma.badgeScan.findUnique({
            where: { id: scanId },
            include: {
                rfidReader: {
                    include: {
                        organization: {
                            include: { meals: true },
                        },
                    },
                },
            },
        });

        if (!currentState)
            return NextResponse.json({ error: 'Scan not found' }, { status: 404 });


        if (decision === RequestStatus.ACCEPTED) {
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            const meals = currentState.rfidReader.organization.meals;

            const inMealWindow = meals.some((meal) => {
                const start = new Date(meal.startTime);
                const end = new Date(meal.endTime);
                const startMinutes = start.getHours() * 60 + start.getMinutes();
                const endMinutes = end.getHours() * 60 + end.getMinutes();
                return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
            });

            if (!inMealWindow) {
                await prisma.badgeScan.update({
                    where: { id: scanId },
                    data: { status: RequestStatus.REJECTED },
                });
                return NextResponse.json({ success: true, decision: RequestStatus.REJECTED, reason: 'Meal window closed' });
            }
        }

        await prisma.badgeScan.update({
            where: { id: scanId },
            data: { status: decision },
        });

        return NextResponse.json({ success: true, decision });
    } catch (error) {
        console.error('Failed to decide scan:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
