import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const organizations = await prisma.organization.findMany({
            select: {
                id: true,
                name: true,
                type: true,
                service: true,
                badgeTimes: true,
                active: true,
                createdAt: true,
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                organizations
            }
        });
        
    } catch (error) {
        return NextResponse.json({
            success: false,
            data: null
        });
    }
}

