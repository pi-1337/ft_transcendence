"use server"

import { NextRequest, NextResponse } from "next/server";
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

        const org = await prisma.organization.findUnique({ where: { id: orgId } });

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

        const userInOrg = await prisma.user.findFirst({
            where: { email, orgs: { some: { id: orgId } } }
        });

        if (userInOrg) {
            return NextResponse.json({
                success: false,
                error: "User is already a member of the organization !!"
            },
                { status: 400 });
        }

        await prisma.user.update({
            where: {
                email
            },
            data: {
                orgs: { connect: { id: orgId } }
            }
        });

        return NextResponse.json(
            {
                success: true
                , user: {
                    id: userToAdd.id,
                    firstname: userToAdd.firstname,
                    lastname: userToAdd.lastname,
                    email: userToAdd.email,
                }
            },
            { status: 200 }
        );

    } catch {
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
