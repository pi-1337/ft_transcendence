'use server'

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
import { cookies } from "next/headers";
import { ft_sign } from "@/lib/jwtHelper";
import { User } from "@prisma/client";
import { updateTag } from "next/cache";

const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePhone = (validatePhone: string) => {
    return /^\+[1-9]\d{7,14}$/.test(validatePhone);
};

export async function POST(req: NextRequest) {

    try {

        const { email, password, firstname, lastname, phoneNumber } = await req.json();

        if (!email || !password || !firstname || !lastname || !phoneNumber) {
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

        if (!validatePhone(phoneNumber)) {
            return NextResponse.json({
                success: false,
                error: "Invalid phone number format !!"
            },
                { status: 400 });
        }

        const user: User = await prisma.user.findUnique({ where: { email } });

        if (user) {
            return NextResponse.json({
                success: false,
                error: "User already exists !!"
            },
                { status: 500 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const createdUser = await prisma.user.create({ data: {
            firstname,
            lastname,
            phoneNumber,
            email,
            password: hashedPassword,
        } });

        return NextResponse.json(
            {
                success: true,
                user: {
                    id: createdUser.id,
                    email: createdUser.email,
                    firstname: createdUser.firstname,
                    lastname: createdUser.lastname,
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
