import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"

export async function GET(req: NextRequest) {
    try {
        const admin: User = await prisma.user.findFirst({
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

        await prisma.user.create({
            data: {
                firstname: process.env.ADMIN_FIRSTNAME,
                lastname: process.env.ADMIN_LASTNAME,
                phoneNumber: process.env.ADMIN_PHONE,
                email: process.env.ADMIN_EMAIL,
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

