import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"

export async function GET(req: NextRequest) {
    try {
        const admin: User | null = await prisma.user.findFirst({
            where: {
                role: "ADMIN"
            }
        });

        if (admin) {
            return NextResponse.json({
                success: false,
                error: "admin already exists !"
            })
        }

        const firstname = process.env.ADMIN_FIRSTNAME;
        const lastname = process.env.ADMIN_LASTNAME;
        const email = process.env.ADMIN_EMAIL;

        if (!firstname || !lastname || !email) {
            return NextResponse.json({
                success: false,
                error: "Missing ADMIN_FIRSTNAME, ADMIN_LASTNAME or ADMIN_EMAIL env vars"
            }, { status: 500 });
        }

        await prisma.user.create({
            data: {
                firstname,
                lastname,
                phoneNumber: process.env.ADMIN_PHONE,
                email,
                password: await bcrypt.hash(
                    process.env.ADMIN_PASS || "very-secure-admin-password", 10
                ),
                role: "ADMIN"
            }
        })

        return NextResponse.json({
            success: true,
            error: "admin created successfully !"
        })

    } catch (error) {
        // console.error(error)
        return NextResponse.json({
            success: false,
            error: "Something went wrong"
        })
    }
}

