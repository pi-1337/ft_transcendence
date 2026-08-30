import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();

        if (!session)
            return NextResponse.json({ error: "Unauthorized" }/* IN_CASE_OF_BAD_IDEA , { status: 401 } IN_CASE_OF_BAD_IDEA */);
        if (session.role !== 'ADMIN')
            return NextResponse.json({ error: "Forbidden" }/* IN_CASE_OF_BAD_IDEA , { status: 403 } IN_CASE_OF_BAD_IDEA */);

        const { name, type, service, badgeTimes, active, callBackURL } = await req.json();

        if (!name || !type || !service || badgeTimes === undefined)
            return NextResponse.json({ error: "name, type, service and badgeTimes are required" }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

        const bt = parseInt(badgeTimes);
        if (isNaN(bt) || bt < 1)
            return NextResponse.json({ error: "badgeTimes must be a positive integer" }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

        if (active !== undefined && active !== 'TRUE' && active !== 'FALSE')
            return NextResponse.json({ error: "active must be TRUE or FALSE" }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

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

        return NextResponse.json({ success: true, org: { id: org.id, name: org.name } }/* IN_CASE_OF_BAD_IDEA , { status: 201 } IN_CASE_OF_BAD_IDEA */);

    } catch (error) {
        // console.error(error);
        return NextResponse.json({ error: "Something went wrong" }/* IN_CASE_OF_BAD_IDEA , { status: 500 } IN_CASE_OF_BAD_IDEA */);
    }
}
