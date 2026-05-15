import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
    try {
        const userId = await getSession();

        if (!userId)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        if (!user || user.role !== 'ADMIN')
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const { id: rawId } = await params;
        const orgId = parseInt(rawId);
        if (isNaN(orgId))
            return NextResponse.json({ error: "Invalid organization ID" }, { status: 400 });

        const { name, type, service, badgeTimes, active, callBackURL } = await req.json();

        if (!name && !type && !service && badgeTimes === undefined && active === undefined && callBackURL === undefined)
            return NextResponse.json({ error: "No fields provided" }, { status: 400 });

        const data: Record<string, unknown> = {};
        if (name !== undefined) data.name = name;
        if (type !== undefined) data.type = type;
        if (service !== undefined) data.service = service;
        if (badgeTimes !== undefined) {
            const bt = parseInt(badgeTimes);
            if (isNaN(bt) || bt < 1)
                return NextResponse.json({ error: "badgeTimes must be a positive integer" }, { status: 400 });
            data.badgeTimes = bt;
        }
        if (active !== undefined) {
            if (active !== 'TRUE' && active !== 'FALSE')
                return NextResponse.json({ error: "active must be TRUE or FALSE" }, { status: 400 });
            data.active = active;
        }
        if (callBackURL !== undefined) data.callBackURL = callBackURL || null;

        const org = await prisma.organization.update({
            where: { id: orgId },
            data,
        });

        return NextResponse.json({ success: true, org }, { status: 200 });

    } catch (error: unknown) {
        if ((error as { code?: string }).code === 'P2025')
            return NextResponse.json({ error: "Organization not found" }, { status: 404 });
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
