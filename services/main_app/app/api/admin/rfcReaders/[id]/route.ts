import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/sessionManage";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: rawId } = await params;
    const id = parseInt(rawId);
    if (isNaN(id))
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    await prisma.rfidReaders.delete({ where: { id } });

    return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: rawId } = await params;
    const id = parseInt(rawId);
    if (isNaN(id))
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const { location, organizationId } = await req.json();
    if (!location || !organizationId)
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    try {
        const reader = await prisma.rfidReaders.update({
            where: { id },
            data: { location, organizationId },
        });
        return NextResponse.json({ success: true, reader });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
