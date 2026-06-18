import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/sessionManage';
import { RequestStatus } from '@prisma/client';

export async function POST(req: NextRequest)
{
    const session = await getSession();
    if (!session || session.role !== 'ADMIN')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { requestId, decision } = await req.json();
    if (!requestId || ![RequestStatus.ACCEPTED, RequestStatus.REJECTED].includes(decision))
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    const currentState = await prisma.zoomBadgeScan.findFirst({
        where: {id: requestId },
    });
    if (currentState?.status != RequestStatus.PENDING)
        return NextResponse.json({ error: 'Request is no longer pending' }, { status: 409 });
    // This tells the database: "Find row 42, and change its status."
    await prisma.zoomBadgeScan.update({
        where: { 
            id: requestId 
        },
        data: { 
            status: decision 
        }
    });


    return NextResponse.json({ success: true, decision });
}
