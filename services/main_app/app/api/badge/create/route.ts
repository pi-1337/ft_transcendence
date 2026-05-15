'use server'

import { NextRequest, NextResponse } from "next/server";
import { User, Organization } from "@prisma/client";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { email, orgId } = await req.json();
        const id: number | null = await getSession();

        if (id === null) {
            return NextResponse.json({
                success: false,
                error: "You are not logged in !!"
            },
                { status: 401 });
        }

        if (!email) {
            return NextResponse.json({
                success: false,
                error: "No email provided !!"
            },
                { status: 404 });
        }

        if (!orgId) {
            return NextResponse.json({
                success: false,
                error: "No organization provided !!"
            },
                { status: 404 });
        }

        const org: Organization | null = await prisma.organization.findUnique({
            where: { id: orgId }
        })

        if (!org) {
            return NextResponse.json({
                success: false,
                error: "No such organization !!"
            },
                { status: 404 });
        }

        const user: User | null = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return NextResponse.json({
                success: false,
                error: "No such user !!"
            },
                { status: 404 });
        }

        const userInOrg: User | null = await prisma.user.findUnique({
            where: { email, orgs: { some: { id: orgId } } }
        })

        if (!userInOrg) {
            return NextResponse.json({
                success: false,
                error: "No such user in organization !!"
            },
                { status: 404 });
        }

        const existingBadge = await prisma.badge.findUnique({
            where: {
                userId_orgId: {
                    userId: user.id,
                    orgId: orgId
                }
            }
        });

        if (existingBadge) {
            return NextResponse.json({
                success: false,
                error: "User already has badge in this organization !!"
            },
                { status: 404 });
        }

        const createdBadge = await prisma.badge.create({
            data: {
                number: Math.floor(Math.random() * 1_000_000_000_000).toString(),
                user: { connect: { email } },
                org: { connect: { id: orgId } },
            }
        })

        return NextResponse.json(
            {
                success: true,
                data: {
                    badgeNumber: createdBadge.number,
                }
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
