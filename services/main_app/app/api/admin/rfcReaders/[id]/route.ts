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
