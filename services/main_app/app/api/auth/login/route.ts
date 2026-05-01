'use server'

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
import { cookies } from "next/headers";
import { ft_sign } from "@/lib/jwtHelper";
import { User } from "@prisma/client";

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

        const user: User = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json({
                success: false,
                error: "No such user !!"
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

        const token = ft_sign({ id: user.id });

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
                }
            },
            { status: 200 }
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                error: "Something went wrong !!"
            },
            { status: 500 }
        );
    }

}
