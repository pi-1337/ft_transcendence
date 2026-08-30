import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ft_sign } from "@/lib/jwtHelper";
import { getPendingTwoFactorSession } from "@/lib/sessionManage";
import { verifyTwoFactorChallenge } from "@/lib/twoFactor";

export async function POST(req: NextRequest) {
    try {
        const pending = await getPendingTwoFactorSession();
        if (!pending)
            return NextResponse.json({ success: false, error: "Unauthorized" }/* IN_CASE_OF_BAD_IDEA , { status: 401 } IN_CASE_OF_BAD_IDEA */);

        const { code } = await req.json();

        if (typeof code !== 'string' || !/^\d{4,8}$/.test(code))
            return NextResponse.json({ success: false, error: "Invalid code format" }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

        const verification = await verifyTwoFactorChallenge(pending.id, code, 'LOGIN');
        if (!verification.ok)
            return NextResponse.json({ success: false, error: verification.error }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

        const user = await prisma.user.findUnique({
            where: { id: pending.id },
            select: { id: true, role: true, email: true, firstname: true, lastname: true },
        });

        if (!user)
            return NextResponse.json({ success: false, error: "User not found" }/* IN_CASE_OF_BAD_IDEA , { status: 404 } IN_CASE_OF_BAD_IDEA */);

        const sessionToken = ft_sign({ id: user.id, role: user.role });
        const cookieStorage = await cookies();
        cookieStorage.set('session', sessionToken, { httpOnly: true });
        cookieStorage.delete('pending_2fa');

        return NextResponse.json({
            success: true,
            user,
        }/* IN_CASE_OF_BAD_IDEA , { status: 200 } IN_CASE_OF_BAD_IDEA */);
    } catch {
        return NextResponse.json({ success: false, error: "Something went wrong" }/* IN_CASE_OF_BAD_IDEA , { status: 500 } IN_CASE_OF_BAD_IDEA */);
    }
}
