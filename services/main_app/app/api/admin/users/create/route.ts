import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/sessionManage";
import bcrypt from "bcrypt";

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone: string) => /^\+[1-9]\d{7,14}$/.test(phone);

export async function POST(req: NextRequest) {
    const userId = await getSession();
    if (!userId)
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
    });

    if (!user || user.role !== 'ADMIN')
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    try {
        const { firstname, lastname, email, password, phoneNumber, role } = await req.json();

        if (!firstname || !lastname || !email || !password || !phoneNumber)
            return NextResponse.json({ success: false, error: "All fields are required." }, { status: 400 });

        if (!validateEmail(email))
            return NextResponse.json({ success: false, error: "Invalid email format." }, { status: 400 });

        if (!validatePhone(phoneNumber))
            return NextResponse.json({ success: false, error: "Invalid phone number format." }, { status: 400 });

        if (password.length < 8)
            return NextResponse.json({ success: false, error: "Password must be at least 8 characters." }, { status: 400 });

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing)
            return NextResponse.json({ success: false, error: "Email already in use." }, { status: 409 });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                firstname,
                lastname,
                email,
                password: hashedPassword,
                phoneNumber,
                role: role === 'ADMIN' ? 'ADMIN' : 'USER',
            },
            select: { id: true, firstname: true, lastname: true, email: true, role: true },
        });

        return NextResponse.json({ success: true, user }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
    }
}
