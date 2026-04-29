'use server'

import { NextRequest, NextResponse } from "next/server";
import { User, Organization } from "@prisma/client";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { name, type, service, badgeTimes } = await req.json();
        const id: number | null = await getSession();

        if (id === null) {
            return NextResponse.json({
                success: false,
                error: "You are not logged in !!"
            },
                { status: 401 });
        }

        if (!name || !type || !service || !badgeTimes) {
            return NextResponse.json({
                success: false,
                error: "One of the inputs is not valid !!"
            },
                { status: 400 });
        }

        const user: User = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            return NextResponse.json({
                success: false,
                error: "The current user is deleted or never existed !!"
            },
                { status: 404 });
        }

        await prisma.organization.create({
            data: {
                name,
                type,
                service,
                badgeTimes,
                admin: { connect: { id } },
                users: { connect: { id } }
            }
        });

        return NextResponse.json(
            {
                success: true,
                data: {
                    name,
                    type,
                    service,
                    badgeTimes,
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
