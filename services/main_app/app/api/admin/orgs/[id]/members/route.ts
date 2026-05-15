import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
    try {
        const session = await getSession();

        if (!session)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        if (session.role !== 'ADMIN')
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const { id: rawId } = await params;
        const orgId = parseInt(rawId);
        if (isNaN(orgId))
            return NextResponse.json({ error: "Invalid organization ID" }, { status: 400 });

        const { email } = await req.json();
        if (!email)
            return NextResponse.json({ error: "Email is required" }, { status: 400 });

        const [org, user] = await Promise.all([
            prisma.organization.findUnique({ where: { id: orgId } }),
            prisma.user.findUnique({ where: { email } }),
        ]);

        if (!org)
            return NextResponse.json({ error: "Organization not found" }, { status: 404 });
        if (!user)
            return NextResponse.json({ error: "No user found with that email" }, { status: 404 });

        const alreadyMember = await prisma.organization.findFirst({
            where: { id: orgId, users: { some: { email } } },
        });

        if (alreadyMember)
            return NextResponse.json({ error: "User is already a member of this organization" }, { status: 409 });

        await prisma.user.update({
            where: { email },
            data: { orgs: { connect: { id: orgId } } },
        });

        return NextResponse.json({
            success: true,
            user: { id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email },
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    try {
        const session = await getSession();

        if (!session)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        if (session.role !== 'ADMIN')
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const { id: rawId } = await params;
        const orgId = parseInt(rawId);
        if (isNaN(orgId))
            return NextResponse.json({ error: "Invalid organization ID" }, { status: 400 });

        const { email } = await req.json();
        if (!email)
            return NextResponse.json({ error: "Email is required" }, { status: 400 });

        const [org, user] = await Promise.all([
            prisma.organization.findUnique({ where: { id: orgId } }),
            prisma.user.findUnique({ where: { email } }),
        ]);

        if (!org)
            return NextResponse.json({ error: "Organization not found" }, { status: 404 });
        if (!user)
            return NextResponse.json({ error: "No user found with that email" }, { status: 404 });

        const isMember = await prisma.organization.findFirst({
            where: { id: orgId, users: { some: { email } } },
        });

        if (!isMember)
            return NextResponse.json({ error: "User is not a member of this organization" }, { status: 404 });

        await prisma.$transaction([
            prisma.organization.update({
                where: { id: orgId },
                data: {
                    users: { disconnect: { email } },
                    admins: { disconnect: { email } },
                },
            }),
            prisma.badgeTX.deleteMany({
                where: { badge: { userId: user.id, orgId } },
            }),
            prisma.badge.deleteMany({
                where: { userId: user.id, orgId },
            }),
        ]);

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
