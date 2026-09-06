import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
    try {
        const session = await getSession();

        if (!session)
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        if (session.role !== 'ADMIN')
            return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

        const { id: rawId } = await params;
        const announcementId = parseInt(rawId, 10);
        if (isNaN(announcementId))
            return NextResponse.json({ success: false, error: "Invalid announcement ID" }, { status: 400 });

        const { title, message } = await req.json();

        if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0))
            return NextResponse.json({ success: false, error: "title must be a non-empty string" }, { status: 400 });

        if (message !== undefined && (typeof message !== 'string' || message.trim().length === 0))
            return NextResponse.json({ success: false, error: "message must be a non-empty string" }, { status: 400 });

        if (title === undefined && message === undefined)
            return NextResponse.json({ success: false, error: "No fields provided" }, { status: 400 });

        const announcement = await prisma.announcement.update({
            where: { id: announcementId },
            data: {
                ...(title !== undefined && { title: title.trim() }),
                ...(message !== undefined && { message: message.trim() }),
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

        return NextResponse.json({ success: true, announcement }, { status: 200 });
    } catch (error: unknown) {
        if ((error as { code?: string }).code === 'P2025')
            return NextResponse.json({ success: false, error: "Announcement not found" }, { status: 404 });

        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    try {
        const session = await getSession();

        if (!session)
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        if (session.role !== 'ADMIN')
            return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

        const { id: rawId } = await params;
        const announcementId = parseInt(rawId, 10);
        if (isNaN(announcementId))
            return NextResponse.json({ success: false, error: "Invalid announcement ID" }, { status: 400 });

        await prisma.announcement.delete({
            where: { id: announcementId },
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: unknown) {
        if ((error as { code?: string }).code === 'P2025')
            return NextResponse.json({ success: false, error: "Announcement not found" }, { status: 404 });

        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}
