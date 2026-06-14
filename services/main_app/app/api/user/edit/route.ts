'use server'

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { firstname, lastname, email, phoneNumber } = await req.json();
        const sessionData = await getSession();

        if (sessionData === null) {
            return NextResponse.json({
                success: false,
                error: "You are not logged in !!"
            },
                { status: 401 });
        }

        const id = sessionData.id;

        if (!firstname || !lastname || !email || !phoneNumber) {
            return NextResponse.json({
                success: false,
                error: "No input provided !!"
            },
                { status: 400 });
        }


        await prisma.user.update({
            where: { id },
            data: {
                firstname,
                lastname,
                email,
                phoneNumber,
            }
        });

        return NextResponse.json(
            {
                success: true,
            },
            { status: 200 }
        );

    } catch (error) {
        // console.error(error);
        return NextResponse.json(
            {
                success: false,
                error: "Something went wrong !!"
            },
            { status: 500 }
        );
    }

}
