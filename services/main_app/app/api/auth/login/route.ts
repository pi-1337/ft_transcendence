'use server'

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
import { cookies } from "next/headers";
import { ft_sign } from "@/lib/jwtHelper";
import { startTwoFactorChallenge } from "@/lib/twoFactor";

const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export async function POST(req: NextRequest) {


    try {

        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({
                success: false,
                error: "Invalid email or password !!"
            },
                { status: 400 });
        }

        if (!validateEmail(email)) {
            return NextResponse.json({
                success: false,
                error: "Invalid email format !!"
            },
                { status: 400 });
        }

        const user = await prisma.user.findUniqueOrThrow({ where: { email } });

        if (!user.password) {
            return NextResponse.json({
                success: false,
                error: "User does not have a password, use Oauth to authenticate !!"
            },
                { status: 404 });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (validPassword !== true) {
            return NextResponse.json({
                success: false,
                error: "Incorrect password !!"
            },
                { status: 401 }

            );
        }

        if (user.twoFactorEnabled) {
            const pendingToken = ft_sign({ id: user.id, role: user.role, flow: 'login' }, '10m');
            const destinationEmail = user.twoFactorEmail || user.email;
            const challengeMeta = await startTwoFactorChallenge(user.id, destinationEmail, 'LOGIN');

            const cookieStorage = await cookies();
            cookieStorage.set('pending_2fa', pendingToken, {
                httpOnly: true,
            });

            return NextResponse.json(
                {
                    success: true,
                    requiresTwoFactor: true,
                    maskedEmail: challengeMeta.maskedEmail,
                    expiresInMinutes: challengeMeta.expiresInMinutes,
                },
                { status: 200 }
            );
        }

        const token = ft_sign({ id: user.id, role: user.role });

        const cookieStorage = await cookies();
        cookieStorage.set('session', token, {
            httpOnly: true,
        });

        return NextResponse.json(
            {
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    role: user.role,
                }
            },
            { status: 200 }
        );

    } catch (error: unknown) {
        if ((error as { code?: string }).code === 'P2025') {
            return NextResponse.json(
                {
                    success: false,
                    error: "No such user !!"
                },
                { status: 404 }
            );
        }

        const message = error instanceof Error ? error.message : "Something went wrong !!";

        return NextResponse.json(
            {
                success: false,
                error: process.env.NODE_ENV === 'production' ? "Something went wrong !!" : message
            },
            { status: 500 }
        );
    }

}
