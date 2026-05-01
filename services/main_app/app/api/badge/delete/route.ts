'use server'

import { NextRequest, NextResponse } from "next/server";
import { User, Organization, Badge } from "@prisma/client";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { badgeNumber } = await req.json();
        const id: number | null = await getSession();

        if (id === null) {
            return NextResponse.json({
                success: false,
                error: "You are not logged in !!"
            },
                { status: 401 });
        }

        if (!badgeNumber) {
            return NextResponse.json({
                success: false,
                error: "No badge number provided !!"
            },
                { status: 404 });
        }

        const badge: Badge | null = await prisma.badge.findUnique({
            where: { number: badgeNumber }
        });

        if (!badge) {
            return NextResponse.json({
                success: false,
                error: "No such badge !!"
            },
                { status: 404 });
        }


        await prisma.badge.delete({
            where: { number: badgeNumber }
        });


        return NextResponse.json(
            {
                success: true,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                error: "Something went wrong, try again !!"
            },
            { status: 500 }
        );
    }

}
