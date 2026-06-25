"use server"

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";

async function handleEdit(req: NextRequest) {
    try {
        const { name, type, service, badgeTimes, active, callBackURL, orgId } = await req.json();
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

        const isOrgAdmin = await prisma.organization.findFirst({
            where: { id: orgId, admins: { some: { id } } }
        });

        if (!isOrgAdmin) {
            return NextResponse.json({
                success: false,
                error: "You are not the admin of the organization !!"
            },
                { status: 403 });
        }

        if (!name && !type && !service && badgeTimes === undefined && active === undefined && callBackURL === undefined) {
            return NextResponse.json({
                success: false,
                error: "No fields provided !!"
            },
                { status: 400 });
        }

        const data: Record<string, unknown> = {};
        if (name !== undefined) data.name = name;
        if (type !== undefined) data.type = type;
        if (service !== undefined) data.service = service;
        if (badgeTimes !== undefined) {
            const parsedBadgeTimes = parseInt(String(badgeTimes), 10);
            if (isNaN(parsedBadgeTimes) || parsedBadgeTimes < 1) {
                return NextResponse.json({
                    success: false,
                    error: "Badge times must be a positive integer !!"
                }, { status: 400 });
            }
            data.badgeTimes = parsedBadgeTimes;
        }
        if (active !== undefined) {
            if (active !== "TRUE" && active !== "FALSE") {
                return NextResponse.json({
                    success: false,
                    error: "Active must be TRUE or FALSE !!"
                }, { status: 400 });
            }
            data.active = active;
        }
        if (callBackURL !== undefined) data.callBackURL = callBackURL || null;

        const updatedOrg = await prisma.organization.update({
            where: {
                id: orgId
            },
            data
        });

        return NextResponse.json(
            {
                success: true,
                org: updatedOrg
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

export async function POST(req: NextRequest) {
    return handleEdit(req);
}

export async function PATCH(req: NextRequest) {
    return handleEdit(req);
}
