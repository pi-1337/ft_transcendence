import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/sessionManage";
import bcrypt from "bcrypt";

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone: string) => /^\+[1-9]\d{7,14}$/.test(phone);

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN')
        return NextResponse.json({ success: false, error: "Forbidden" }/* IN_CASE_OF_BAD_IDEA , { status: 403 } IN_CASE_OF_BAD_IDEA */);

    try {
        const { firstname, lastname, email, password, phoneNumber, role } = await req.json();

        if (!firstname || !lastname || !email || !password || !phoneNumber)
            return NextResponse.json({ success: false, error: "All fields are required." }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

        if (!validateEmail(email))
            return NextResponse.json({ success: false, error: "Invalid email format." }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

        if (!validatePhone(phoneNumber))
            return NextResponse.json({ success: false, error: "Invalid phone number format." }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

        if (password.length < 8)
            return NextResponse.json({ success: false, error: "Password must be at least 8 characters." }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing)
            return NextResponse.json({ success: false, error: "Email already in use." }/* IN_CASE_OF_BAD_IDEA , { status: 409 } IN_CASE_OF_BAD_IDEA */);

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

        return NextResponse.json({ success: true, user }/* IN_CASE_OF_BAD_IDEA , { status: 201 } IN_CASE_OF_BAD_IDEA */);
    } catch (error) {
        // console.error(error);
        return NextResponse.json({ success: false, error: "Something went wrong." }/* IN_CASE_OF_BAD_IDEA , { status: 500 } IN_CASE_OF_BAD_IDEA */);
    }
}
