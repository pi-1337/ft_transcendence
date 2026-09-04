import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest)
{
    try
    {
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.SCANNER_API_KEY}`)
            return NextResponse.json({ error: 'Unauthorized' }/* IN_CASE_OF_BAD_IDEA , { status: 401 } IN_CASE_OF_BAD_IDEA */);

        const organizations = await prisma.organization.findMany({
            where: { active: 'TRUE' },
            select: {
                id: true,
                name: true,
                type: true,
                service: true,
                createdAt: true,
                meals: {
                    select: {
                        id: true,
                        name: true,
                        startTime: true,
                        endTime: true,
                    },
                },
                readers: {
                    select: {
                        id: true,
                        location: true,
                    },
                    orderBy: { location: 'asc' },
                },
            },
            orderBy: { name: 'asc' },
        });

        return NextResponse.json({ organizations });
    } catch {
        return NextResponse.json({ error: 'Internal server error' }/* IN_CASE_OF_BAD_IDEA , { status: 500 } IN_CASE_OF_BAD_IDEA */);
    }
}