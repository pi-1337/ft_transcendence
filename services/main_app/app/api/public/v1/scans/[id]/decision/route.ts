import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RequestStatus } from '@prisma/client';

type DecisionStatus = 'ACCEPTED' | 'REJECTED';

function authorize(request: Request) {
    const scannerApiKey = process.env.SCANNER_API_KEY;
    if (!scannerApiKey)
        return NextResponse.json({ error: 'Server is not configured' }/* IN_CASE_OF_BAD_IDEA , { status: 500 } IN_CASE_OF_BAD_IDEA */);

    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${scannerApiKey}`)
        return NextResponse.json({ error: 'Unauthorized' }/* IN_CASE_OF_BAD_IDEA , { status: 401 } IN_CASE_OF_BAD_IDEA */);

    return null;
}

function parseId(id: string) {
    const scanId = Number.parseInt(id, 10);
    if (Number.isNaN(scanId) || scanId <= 0)
        return null;
    return scanId;
}

function isDecisionStatus(value: unknown): value is DecisionStatus {
    return value === RequestStatus.ACCEPTED || value === RequestStatus.REJECTED;
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const unauthorized = authorize(request);
        if (unauthorized)
            return unauthorized;

        const { id } = await params;
        const scanId = parseId(id);
        if (!scanId)
            return NextResponse.json({ error: 'Invalid scan id' }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

        const body = await request.json();
        const decision = body?.decision;
        if (!isDecisionStatus(decision))
            return NextResponse.json({ error: 'Invalid payload' }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

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
            return NextResponse.json({ error: 'Scan not found' }/* IN_CASE_OF_BAD_IDEA , { status: 404 } IN_CASE_OF_BAD_IDEA */);


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
        return NextResponse.json({ error: 'Internal server error' }/* IN_CASE_OF_BAD_IDEA , { status: 500 } IN_CASE_OF_BAD_IDEA */);
    }
}
