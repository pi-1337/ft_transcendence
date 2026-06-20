import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/sessionManage";
import { startTwoFactorChallenge, verifyTwoFactorChallenge } from "@/lib/twoFactor";

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session)
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        const { action, password, code } = await req.json();

        const user = await prisma.user.findUnique({
            where: { id: session.id },
            select: {
                id: true,
                email: true,
                password: true,
                twoFactorEnabled: true,
                twoFactorEmail: true,
            },
        });

        if (!user)
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

        const destinationEmail = user.twoFactorEmail || user.email;

        if (action === 'request_enable' || action === 'request_disable') {
            if (user.password) {
                if (typeof password !== 'string' || password.length === 0)
                    return NextResponse.json({ success: false, error: "Password is required" }, { status: 400 });

                const validPassword = await bcrypt.compare(password, user.password);
                if (!validPassword)
                    return NextResponse.json({ success: false, error: "Incorrect password" }, { status: 401 });
            }

            if (action === 'request_enable' && user.twoFactorEnabled)
                return NextResponse.json({ success: false, error: "2FA already enabled" }, { status: 400 });

            if (action === 'request_disable' && !user.twoFactorEnabled)
                return NextResponse.json({ success: false, error: "2FA already disabled" }, { status: 400 });

            const purpose = action === 'request_enable' ? 'ENABLE' : 'DISABLE';
            const startResult = await startTwoFactorChallenge(user.id, destinationEmail, purpose);
            return NextResponse.json({ success: true, ...startResult }, { status: 200 });
        }

        if (action === 'confirm_enable' || action === 'confirm_disable') {
            if (typeof code !== 'string' || !/^\d{4,8}$/.test(code))
                return NextResponse.json({ success: false, error: "Invalid code format" }, { status: 400 });

            const purpose = action === 'confirm_enable' ? 'ENABLE' : 'DISABLE';
            const verification = await verifyTwoFactorChallenge(user.id, code, purpose);
            if (!verification.ok)
                return NextResponse.json({ success: false, error: verification.error }, { status: 400 });

            const enabled = action === 'confirm_enable';
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    twoFactorEnabled: enabled,
                    ...(enabled ? { twoFactorEmail: destinationEmail } : {}),
                },
            });

            return NextResponse.json({ success: true, twoFactorEnabled: enabled }, { status: 200 });
        }

        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
    } catch {
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}
