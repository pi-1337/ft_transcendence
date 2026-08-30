import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
    try {
        const session = await getSession();

        if (!session)
            return NextResponse.json({ error: "Unauthorized" }/* IN_CASE_OF_BAD_IDEA , { status: 401 } IN_CASE_OF_BAD_IDEA */);
        if (session.role !== 'ADMIN')
            return NextResponse.json({ error: "Forbidden" }/* IN_CASE_OF_BAD_IDEA , { status: 403 } IN_CASE_OF_BAD_IDEA */);

        const { id: rawId } = await params;
        const orgId = parseInt(rawId);
        if (isNaN(orgId))
            return NextResponse.json({ error: "Invalid organization ID" }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

        const { name, type, service, badgeTimes, active, callBackURL } = await req.json();

        if (!name && !type && !service && badgeTimes === undefined && active === undefined && callBackURL === undefined)
            return NextResponse.json({ error: "No fields provided" }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

        const data: Record<string, unknown> = {};
        if (name !== undefined) data.name = name;
        if (type !== undefined) data.type = type;
        if (service !== undefined) data.service = service;
        if (badgeTimes !== undefined) {
            const bt = parseInt(badgeTimes);
            if (isNaN(bt) || bt < 1)
                return NextResponse.json({ error: "badgeTimes must be a positive integer" }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);
            data.badgeTimes = bt;
        }
        if (active !== undefined) {
            if (active !== 'TRUE' && active !== 'FALSE')
                return NextResponse.json({ error: "active must be TRUE or FALSE" }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);
            data.active = active;
        }
        if (callBackURL !== undefined) data.callBackURL = callBackURL || null;

        const org = await prisma.organization.update({
            where: { id: orgId },
            data,
        });

        return NextResponse.json({ success: true, org }/* IN_CASE_OF_BAD_IDEA , { status: 200 } IN_CASE_OF_BAD_IDEA */);

    } catch (error: unknown) {
        if ((error as { code?: string }).code === 'P2025')
            return NextResponse.json({ error: "Organization not found" }/* IN_CASE_OF_BAD_IDEA , { status: 404 } IN_CASE_OF_BAD_IDEA */);
        return NextResponse.json({ error: "Something went wrong" }/* IN_CASE_OF_BAD_IDEA , { status: 500 } IN_CASE_OF_BAD_IDEA */);
    }
}
