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
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        const { code } = await req.json();

        if (typeof code !== "string" || !/^\d{4,8}$/.test(code))
            return NextResponse.json({ success: false, error: "Invalid code format" }, { status: 400 });

        const verification = await verifyTwoFactorChallenge(pending.id, code, "LOGIN");
        if (!verification.ok)
            return NextResponse.json({ success: false, error: verification.error }, { status: 400 });

        const user = await prisma.user.findUnique({
            where: { id: pending.id },
            select: { id: true, role: true, email: true, firstname: true, lastname: true },
        });

        if (!user)
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

        const sessionToken = ft_sign({ id: user.id, role: user.role });
        const cookieStorage = await cookies();
        cookieStorage.set("session", sessionToken, { httpOnly: true });
        cookieStorage.delete("pending_2fa");

        return NextResponse.json({
            success: true,
            user,
        }, { status: 200 });
    } catch {
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}
