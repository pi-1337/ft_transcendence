import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPendingTwoFactorSession } from "@/lib/sessionManage";
import { startTwoFactorChallenge } from "@/lib/twoFactor";

export async function POST() {
    try {
        const pending = await getPendingTwoFactorSession();
        if (!pending)
            return NextResponse.json({ success: false, error: "Unauthorized" }/* IN_CASE_OF_BAD_IDEA , { status: 401 } IN_CASE_OF_BAD_IDEA */);

        const user = await prisma.user.findUnique({
            where: { id: pending.id },
            select: {
                email: true,
                twoFactorEmail: true,
                twoFactorEnabled: true,
            },
        });

        if (!user || !user.twoFactorEnabled)
            return NextResponse.json({ success: false, error: "2FA is not enabled" }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

        const destinationEmail = user.twoFactorEmail || user.email;
        const result = await startTwoFactorChallenge(pending.id, destinationEmail, 'LOGIN');

        return NextResponse.json({ success: true, ...result }/* IN_CASE_OF_BAD_IDEA , { status: 200 } IN_CASE_OF_BAD_IDEA */);
    } catch {
        return NextResponse.json({ success: false, error: "Something went wrong" }/* IN_CASE_OF_BAD_IDEA , { status: 500 } IN_CASE_OF_BAD_IDEA */);
    }
}
