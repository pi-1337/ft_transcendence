import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/sessionManage";

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session || session.role !== "ADMIN")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { location, organizationId } = await req.json();

    if (!location || !organizationId)
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    try {
        const reader = await prisma.rfidReaders.create({
            data: { location, organizationId },
        });
        return NextResponse.json({ success: true, reader });
    } catch (error) {
        // console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
