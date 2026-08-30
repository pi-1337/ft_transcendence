import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/sessionManage";

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone: string) => /^\+[1-9]\d{7,14}$/.test(phone);

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN')
        return NextResponse.json({ success: false, error: "Forbidden" }/* IN_CASE_OF_BAD_IDEA , { status: 403 } IN_CASE_OF_BAD_IDEA */);

    const { id: rawId } = await params;
    const targetId = parseInt(rawId);
    if (isNaN(targetId))
        return NextResponse.json({ success: false, error: "Invalid user ID." }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

    try {
        const { firstname, lastname, email, phoneNumber, role } = await req.json();

        if (email !== undefined && !validateEmail(email))
            return NextResponse.json({ success: false, error: "Invalid email format." }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

        if (phoneNumber !== undefined && !validatePhone(phoneNumber))
            return NextResponse.json({ success: false, error: "Invalid phone number format." }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

        if (email !== undefined) {
            const existing = await prisma.user.findFirst({ where: { email, NOT: { id: targetId } } });
            if (existing)
                return NextResponse.json({ success: false, error: "Email already in use." }/* IN_CASE_OF_BAD_IDEA , { status: 409 } IN_CASE_OF_BAD_IDEA */);
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

        return NextResponse.json({ success: true, user }/* IN_CASE_OF_BAD_IDEA , { status: 200 } IN_CASE_OF_BAD_IDEA */);
    } catch (error: any) {
        if (error?.code === 'P2025')
            return NextResponse.json({ success: false, error: "User not found." }/* IN_CASE_OF_BAD_IDEA , { status: 404 } IN_CASE_OF_BAD_IDEA */);
        // console.error(error);
        return NextResponse.json({ success: false, error: "Something went wrong." }/* IN_CASE_OF_BAD_IDEA , { status: 500 } IN_CASE_OF_BAD_IDEA */);
    }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN')
        return NextResponse.json({ success: false, error: "Forbidden" }/* IN_CASE_OF_BAD_IDEA , { status: 403 } IN_CASE_OF_BAD_IDEA */);

    const { id: rawId } = await params;
    const targetId = parseInt(rawId);
    if (isNaN(targetId))
        return NextResponse.json({ success: false, error: "Invalid user ID." }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

    if (targetId === session.id)
        return NextResponse.json({ success: false, error: "You cannot delete your own account." }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

    try {
        await prisma.user.delete({ where: { id: targetId } });
        return NextResponse.json({ success: true }/* IN_CASE_OF_BAD_IDEA , { status: 200 } IN_CASE_OF_BAD_IDEA */);
    } catch (error: any) {
        if (error?.code === 'P2025')
            return NextResponse.json({ success: false, error: "User not found." }/* IN_CASE_OF_BAD_IDEA , { status: 404 } IN_CASE_OF_BAD_IDEA */);
        // console.error(error);
        return NextResponse.json({ success: false, error: "Something went wrong." }/* IN_CASE_OF_BAD_IDEA , { status: 500 } IN_CASE_OF_BAD_IDEA */);
    }
}
