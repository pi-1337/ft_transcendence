import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";
import { sendNotification } from "@/lib/notificationManager";

function parseOrgId(rawValue: string | null): number | null {
    if (!rawValue)
        return null;

    const parsed = parseInt(rawValue, 10);
    if (isNaN(parsed))
        return null;

    return parsed;
}

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();

        if (!session)
            return NextResponse.json({ success: false, error: "Unauthorized" }/* IN_CASE_OF_BAD_IDEA , { status: 401 } IN_CASE_OF_BAD_IDEA */);
        if (session.role !== 'ADMIN')
            return NextResponse.json({ success: false, error: "Forbidden" }/* IN_CASE_OF_BAD_IDEA , { status: 403 } IN_CASE_OF_BAD_IDEA */);

        const orgId = parseOrgId(req.nextUrl.searchParams.get('orgId'));

        const announcements = await prisma.announcement.findMany({
            where: orgId ? { organizationId: orgId } : undefined,
            select: {
                id: true,
                title: true,
                message: true,
                createdAt: true,
                updatedAt: true,
                organizationId: true,
                organization: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                createdBy: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ success: true, announcements }/* IN_CASE_OF_BAD_IDEA , { status: 200 } IN_CASE_OF_BAD_IDEA */);
    } catch {
        return NextResponse.json({ success: false, error: "Something went wrong" }/* IN_CASE_OF_BAD_IDEA , { status: 500 } IN_CASE_OF_BAD_IDEA */);
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();

        if (!session)
            return NextResponse.json({ success: false, error: "Unauthorized" }/* IN_CASE_OF_BAD_IDEA , { status: 401 } IN_CASE_OF_BAD_IDEA */);
        if (session.role !== 'ADMIN')
            return NextResponse.json({ success: false, error: "Forbidden" }/* IN_CASE_OF_BAD_IDEA , { status: 403 } IN_CASE_OF_BAD_IDEA */);

        const { organizationId, title, message } = await req.json();

        const parsedOrganizationId = parseInt(organizationId, 10);
        if (isNaN(parsedOrganizationId))
            return NextResponse.json({ success: false, error: "Invalid organizationId" }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

        if (typeof title !== 'string' || title.trim().length === 0)
            return NextResponse.json({ success: false, error: "title is required" }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

        if (typeof message !== 'string' || message.trim().length === 0)
            return NextResponse.json({ success: false, error: "message is required" }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

        const org = await prisma.organization.findUnique({
            where: { id: parsedOrganizationId },
            select: {
                id: true,
                name: true,
                users: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!org)
            return NextResponse.json({ success: false, error: "Organization not found" }/* IN_CASE_OF_BAD_IDEA , { status: 404 } IN_CASE_OF_BAD_IDEA */);

        const announcement = await prisma.announcement.create({
            data: {
                title: title.trim(),
                message: message.trim(),
                organizationId: org.id,
                userId: session.id,
            },
            select: {
                id: true,
                title: true,
                message: true,
                createdAt: true,
                updatedAt: true,
                organizationId: true,
                organization: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                createdBy: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                        email: true,
                    },
                },
            },
        });

        const userIds = org.users.map((u: { id: number }) => u.id);
        if (userIds.length > 0) {
            const notificationMessage = `[${title.trim()}] ${message.trim()}`;
            await sendNotification(userIds, notificationMessage);
        }

        return NextResponse.json(
            {
                success: true,
                announcement,
                sentToUsers: userIds.length,
            },
            { status: 201 }
        );
    } catch {
        return NextResponse.json({ success: false, error: "Something went wrong" }/* IN_CASE_OF_BAD_IDEA , { status: 500 } IN_CASE_OF_BAD_IDEA */);
    }
}
