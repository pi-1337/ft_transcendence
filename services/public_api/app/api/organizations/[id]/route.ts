import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{id: string}> }
) {
    try {
        const organization = await prisma.organization.findUnique({
            where: { id: parseInt((await params).id) },
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
                organization
            }
        });
        
    } catch (error) {
        return NextResponse.json({
            success: false,
            data: null
        });
    }
}

