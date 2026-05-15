import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
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

        const { name, type, service, badgeTimes, active, callBackURL } = await req.json();

        if (!name || !type || !service || badgeTimes === undefined)
            return NextResponse.json({ error: "name, type, service and badgeTimes are required" }, { status: 400 });

        const bt = parseInt(badgeTimes);
        if (isNaN(bt) || bt < 1)
            return NextResponse.json({ error: "badgeTimes must be a positive integer" }, { status: 400 });

        if (active !== undefined && active !== 'TRUE' && active !== 'FALSE')
            return NextResponse.json({ error: "active must be TRUE or FALSE" }, { status: 400 });

        const org = await prisma.organization.create({
            data: {
                name,
                type,
                service,
                badgeTimes: bt,
                active: active ?? 'FALSE',
                callBackURL: callBackURL || null,
            },
        });

        return NextResponse.json({ success: true, org: { id: org.id, name: org.name } }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
