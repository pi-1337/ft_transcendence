'use server'

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
import { cookies } from "next/headers";
import { ft_sign } from "@/lib/jwtHelper";
import { User } from "@prisma/client";
import { updateTag } from "next/cache";
import { getSession } from "@/lib/sessionManage";

const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePhone = (validatePhone: string) => {
    return /^\+[1-9]\d{7,14}$/.test(validatePhone);
};

export async function POST(req: NextRequest) {

    try {
        const id = await getSession();

        if (id === null) {
            return NextResponse.json(
                {
                    success: true,
                    user: null
                },
                { status: 200 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                firstname: true,
                lastname: true,
                phoneNumber: true,
                email: true,
                password: true,
                avatar: true,
            }
        });

        const organizationsJoinedByTheUser = await prisma.organization.findMany({
            where: { users: { some: { id } } },
            select: {
                name: true,
                type: true,
                service: true,
                badgeTimes: true,
                active: true,
            }
        });

        const organizationsCreatedByTheUser = await prisma.organization.findMany({
            where: { adminId: id },
            select: {
                name: true,
                type: true,
                service: true,
                badgeTimes: true,
                active: true,
            }
        });

        return NextResponse.json(
            {
                success: true,
                data: {
                    user,
                    organizationsJoinedByTheUser,
                    organizationsCreatedByTheUser,
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
