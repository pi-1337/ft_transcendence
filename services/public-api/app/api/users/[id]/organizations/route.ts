import { prisma } from "@/lib/prisma";
import { Notification } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {

        const organizations = await prisma.organization.findMany({
            where: { users: { some: {id: parseInt((await params).id)} } },
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

        const owned_organizations = await prisma.organization.findMany({
            where: { admins: { some: {id: parseInt((await params).id)} } },
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
                organizations: [...organizations, ...owned_organizations]
            }
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            data: null
        });
    }
}

