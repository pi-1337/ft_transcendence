'use server'

import { NextRequest, NextResponse } from "next/server";
import { Organization } from "@prisma/client";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { email, orgId } = await req.json();
        const sessionData = await getSession();

        if (sessionData === null) {
            return NextResponse.json({
                success: false,
                error: "You are not logged in !!"
            },
                { status: 401 });
        }
        const id: number = sessionData.id;

        if (!orgId) {
            return NextResponse.json({
                success: false,
                error: "Organization id is not provided !!"
            },
                { status: 400 });
        }

        const org: Organization | null = await prisma.organization.findUnique({ where: { id: orgId } });

        if (!org) {
            return NextResponse.json({
                success: false,
                error: "No such organization with given ID !!"
            },
                { status: 404 });
        }

        if (!email) {
            return NextResponse.json({
                success: false,
                error: "Email is not valid !!"
            },
                { status: 400 });
        }

        const [isOrgAdmin, userToAdd] = await Promise.all([
            prisma.organization.findFirst({ where: { id: orgId, admins: { some: { id } } } }),
            prisma.user.findUnique({ where: { email } })
        ]);

        if (!isOrgAdmin) {
            return NextResponse.json({
                success: false,
                error: "You are not the admin of the organization !!"
            },
                { status: 403 });
        }

        if (!userToAdd) {
            return NextResponse.json({
                success: false,
                error: "The email provided does not correspond to any of our users !!"
            },
                { status: 404 });
        }

        const userInOrg = await prisma.user.findUnique({
            where: { email, orgs: { some: { id: orgId } } }
        });

        if (!userInOrg) {
            return NextResponse.json({
                success: false,
                error: "User is not a member of the organization !!"
            },
                { status: 400 });
        }

        await prisma.$transaction([
            prisma.user.update({
                where: {
                    email
                },
                data: {
                    orgs: { disconnect: { id: orgId } }
                }
            }),

            prisma.badge.delete({
                where: {
                    userId_orgId: {
                        userId: userInOrg.id,
                        orgId
                    }
                }
            })
        ]);

        return NextResponse.json(
            {
                success: true
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
