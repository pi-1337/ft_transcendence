import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/sessionManage";

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone: string) => /^\+[1-9]\d{7,14}$/.test(phone);

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN')
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    const { id: rawId } = await params;
    const targetId = parseInt(rawId);
    if (isNaN(targetId))
        return NextResponse.json({ success: false, error: "Invalid user ID." }, { status: 400 });

    try {
        const { firstname, lastname, email, phoneNumber, role } = await req.json();

        if (email !== undefined && !validateEmail(email))
            return NextResponse.json({ success: false, error: "Invalid email format." }, { status: 400 });

        if (phoneNumber !== undefined && !validatePhone(phoneNumber))
            return NextResponse.json({ success: false, error: "Invalid phone number format." }, { status: 400 });

        if (email !== undefined) {
            const existing = await prisma.user.findFirst({ where: { email, NOT: { id: targetId } } });
            if (existing)
                return NextResponse.json({ success: false, error: "Email already in use." }, { status: 409 });
        }

        const user = await prisma.user.update({
            where: { id: targetId },
            data: {
                ...(firstname !== undefined && { firstname }),
                ...(lastname !== undefined && { lastname }),
                ...(email !== undefined && { email }),
                ...(phoneNumber !== undefined && { phoneNumber }),
                ...(role !== undefined && { role: role === 'ADMIN' ? 'ADMIN' : 'USER' }),
            },
            select: { id: true, firstname: true, lastname: true, email: true, phoneNumber: true, role: true },
        });

        return NextResponse.json({ success: true, user }, { status: 200 });
    } catch (error: any) {
        if (error?.code === 'P2025')
            return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
        console.error(error);
        return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN')
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    const { id: rawId } = await params;
    const targetId = parseInt(rawId);
    if (isNaN(targetId))
        return NextResponse.json({ success: false, error: "Invalid user ID." }, { status: 400 });

    if (targetId === session.id)
        return NextResponse.json({ success: false, error: "You cannot delete your own account." }, { status: 400 });

    try {
        await prisma.user.delete({ where: { id: targetId } });
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        if (error?.code === 'P2025')
            return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
        console.error(error);
        return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
    }
}
