import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const users = await prisma.user.findMany({
            where: { orgs: { some: { id: parseInt((await params).id) } } },
            select: {
                id: true,
                firstname: true,
                lastname: true,
                avatar: true,
                phoneNumber: true,
                email: true,
                login: true,
                role: true,
                createdAt: true,
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                users
            }
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            data: null
        });
    }
}

