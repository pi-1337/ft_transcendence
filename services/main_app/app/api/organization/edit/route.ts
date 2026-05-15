'use server'

import { NextRequest, NextResponse } from "next/server";
import { Organization } from "@prisma/client";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { name, type, service, badgeTimes, orgId } = await req.json();
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

        if (!name && !type && !service && !badgeTimes) {
            return NextResponse.json({
                success: false,
                error: "No input provided !!"
            },
                { status: 400 });
        }

        const data = {
            name: name || org.name,
            type: type || org.type,
            service: service || org.service,
            badgeTimes: badgeTimes || org.badgeTimes,
        };

        await prisma.organization.update({
            where: {
                id: orgId
            },
            data
        });

        return NextResponse.json(
            {
                success: true,
                data
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
