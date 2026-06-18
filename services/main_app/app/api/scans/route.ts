// app/api/scans/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RequestStatus } from '@prisma/client';

// Notice the function is explicitly named 'POST'
export async function POST(request: Request) {
    
    try
    {
        const pendingScan = await prisma.zoomBadgeScan.findFirst({
            where: {
                status: RequestStatus.PENDING
            }
        });
        const count = await prisma.zoomBadgeScan.count({
            where: {
                status: RequestStatus.PENDING
            }
        });
        if (count >= 10) {
            console.warn("Gate is busy. Dropped new scan.");
            // 409 Conflict is the standard HTTP code for "State won't allow this right now"
            return NextResponse.json({ error: "Gate is currently processing a request" }, { status: 409 }); 
        }
        // 1. Parse the incoming JSON from your Python script
        // This is the exact TypeScript equivalent of 'await request.json()' in Python
        const body = await request.json();

        // 2. Insert the new record into the database using Prisma
        const newScan = await prisma.zoomBadgeScan.create({
            data: {
                badgeId: body.badge_id,
                timestampUtc: body.timestamp_utc,
            }
        });

        // 3. Return a 201 Created HTTP status and a success message
        return NextResponse.json({ success: true }, { status: 201 });

    } catch (error)
    {
        // If the database insert fails, or the JSON is bad, catch the crash safely
        console.error("Database Insert Error:", error);
        return NextResponse.json({ error: "Failed to save scan" }, { status: 500 });
    }
}
