import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPendingTwoFactorSession } from "@/lib/sessionManage";
import { startTwoFactorChallenge } from "@/lib/twoFactor";

export async function POST() {
    try {
        const pending = await getPendingTwoFactorSession();
        if (!pending)
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { id: pending.id },
            select: {
                email: true,
                twoFactorEmail: true,
                twoFactorEnabled: true,
            },
        });

        if (!user || !user.twoFactorEnabled)
            return NextResponse.json({ success: false, error: "2FA is not enabled" }, { status: 400 });

        const destinationEmail = user.twoFactorEmail || user.email;
        const result = await startTwoFactorChallenge(pending.id, destinationEmail, "LOGIN");

        return NextResponse.json({ success: true, ...result }, { status: 200 });
    } catch {
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}
