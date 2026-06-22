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

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const unauthorized = authorize(request);
        if (unauthorized)
            return unauthorized;

        const { id } = await params;
        const scanId = parseId(id);
        if (!scanId)
            return NextResponse.json({ error: 'Invalid scan id' }, { status: 400 });

        const scan = await prisma.badgeScan.findUnique({
            where: { id: scanId },
            select: {
                id: true,
                status: true,
                badgeId: true,
                rfidReaderID: true,
                mealId: true,
                createdAt: true,
            },
        });

        if (!scan)
            return NextResponse.json({ error: 'Scan not found' }, { status: 404 });

        return NextResponse.json({ scan });
    } catch (error) {
        console.error('Failed to fetch scan:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const unauthorized = authorize(request);
        if (unauthorized)
            return unauthorized;

        const { id } = await params;
        const scanId = parseId(id);
        if (!scanId)
            return NextResponse.json({ error: 'Invalid scan id' }, { status: 400 });

        const scan = await prisma.badgeScan.findUnique({
            where: { id: scanId },
            select: { id: true, status: true },
        });

        if (!scan)
            return NextResponse.json({ error: 'Scan not found' }, { status: 404 });


        await prisma.badgeScan.delete({ where: { id: scanId } });

        return NextResponse.json({ success: true, id: scanId });
    } catch (error) {
        console.error('Failed to delete scan:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
