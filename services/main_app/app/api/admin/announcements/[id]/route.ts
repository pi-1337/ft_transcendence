import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
    try {
        const session = await getSession();

        if (!session)
            return NextResponse.json({ success: false, error: "Unauthorized" }/* IN_CASE_OF_BAD_IDEA , { status: 401 } IN_CASE_OF_BAD_IDEA */);
        if (session.role !== 'ADMIN')
            return NextResponse.json({ success: false, error: "Forbidden" }/* IN_CASE_OF_BAD_IDEA , { status: 403 } IN_CASE_OF_BAD_IDEA */);

        const { id: rawId } = await params;
        const announcementId = parseInt(rawId, 10);
        if (isNaN(announcementId))
            return NextResponse.json({ success: false, error: "Invalid announcement ID" }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

        const { title, message } = await req.json();

        if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0))
            return NextResponse.json({ success: false, error: "title must be a non-empty string" }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

        if (message !== undefined && (typeof message !== 'string' || message.trim().length === 0))
            return NextResponse.json({ success: false, error: "message must be a non-empty string" }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

        if (title === undefined && message === undefined)
            return NextResponse.json({ success: false, error: "No fields provided" }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

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

        return NextResponse.json({ success: true, announcement }/* IN_CASE_OF_BAD_IDEA , { status: 200 } IN_CASE_OF_BAD_IDEA */);
    } catch (error: unknown) {
        if ((error as { code?: string }).code === 'P2025')
            return NextResponse.json({ success: false, error: "Announcement not found" }/* IN_CASE_OF_BAD_IDEA , { status: 404 } IN_CASE_OF_BAD_IDEA */);

        return NextResponse.json({ success: false, error: "Something went wrong" }/* IN_CASE_OF_BAD_IDEA , { status: 500 } IN_CASE_OF_BAD_IDEA */);
    }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    try {
        const session = await getSession();

        if (!session)
            return NextResponse.json({ success: false, error: "Unauthorized" }/* IN_CASE_OF_BAD_IDEA , { status: 401 } IN_CASE_OF_BAD_IDEA */);
        if (session.role !== 'ADMIN')
            return NextResponse.json({ success: false, error: "Forbidden" }/* IN_CASE_OF_BAD_IDEA , { status: 403 } IN_CASE_OF_BAD_IDEA */);

        const { id: rawId } = await params;
        const announcementId = parseInt(rawId, 10);
        if (isNaN(announcementId))
            return NextResponse.json({ success: false, error: "Invalid announcement ID" }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

        await prisma.announcement.delete({
            where: { id: announcementId },
        });

        return NextResponse.json({ success: true }/* IN_CASE_OF_BAD_IDEA , { status: 200 } IN_CASE_OF_BAD_IDEA */);
    } catch (error: unknown) {
        if ((error as { code?: string }).code === 'P2025')
            return NextResponse.json({ success: false, error: "Announcement not found" }/* IN_CASE_OF_BAD_IDEA , { status: 404 } IN_CASE_OF_BAD_IDEA */);

        return NextResponse.json({ success: false, error: "Something went wrong" }/* IN_CASE_OF_BAD_IDEA , { status: 500 } IN_CASE_OF_BAD_IDEA */);
    }
}
