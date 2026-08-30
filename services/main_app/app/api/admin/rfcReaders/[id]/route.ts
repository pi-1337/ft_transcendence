import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/sessionManage";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN')
        return NextResponse.json({ error: 'Unauthorized' }/* IN_CASE_OF_BAD_IDEA , { status: 401 } IN_CASE_OF_BAD_IDEA */);

    const { id: rawId } = await params;
    const id = parseInt(rawId);
    if (isNaN(id))
        return NextResponse.json({ error: 'Invalid ID' }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

    await prisma.rfidReaders.delete({ where: { id } });

    return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN')
        return NextResponse.json({ error: 'Unauthorized' }/* IN_CASE_OF_BAD_IDEA , { status: 401 } IN_CASE_OF_BAD_IDEA */);

    const { id: rawId } = await params;
    const id = parseInt(rawId);
    if (isNaN(id))
        return NextResponse.json({ error: 'Invalid ID' }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

    const { location, organizationId } = await req.json();
    if (!location || !organizationId)
        return NextResponse.json({ error: 'Missing fields' }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

    try {
        const reader = await prisma.rfidReaders.update({
            where: { id },
            data: { location, organizationId },
        });
        return NextResponse.json({ success: true, reader });
    } catch (error) {
        // console.error(error);
        return NextResponse.json({ error: 'Something went wrong' }/* IN_CASE_OF_BAD_IDEA , { status: 500 } IN_CASE_OF_BAD_IDEA */);
    }
}
