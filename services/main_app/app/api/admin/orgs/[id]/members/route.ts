import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
    try {
        const userId = await getSession();

        if (!userId)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const adminUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        if (!adminUser || adminUser.role !== 'ADMIN')
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const { id: rawId } = await params;
        const orgId = parseInt(rawId);
        if (isNaN(orgId))
            return NextResponse.json({ error: "Invalid organization ID" }, { status: 400 });

        const { email } = await req.json();
        if (!email)
            return NextResponse.json({ error: "Email is required" }, { status: 400 });

        const [org, targetUser] = await Promise.all([
            prisma.organization.findUnique({ where: { id: orgId } }),
            prisma.user.findUnique({ where: { email } }),
        ]);

        if (!org)
            return NextResponse.json({ error: "Organization not found" }, { status: 404 });
        if (!targetUser)
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
            user: { id: targetUser.id, firstname: targetUser.firstname, lastname: targetUser.lastname, email: targetUser.email },
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    try {
        const userId = await getSession();

        if (!userId)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const adminUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        if (!adminUser || adminUser.role !== 'ADMIN')
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const { id: rawId } = await params;
        const orgId = parseInt(rawId);
        if (isNaN(orgId))
            return NextResponse.json({ error: "Invalid organization ID" }, { status: 400 });

        const { email } = await req.json();
        if (!email)
            return NextResponse.json({ error: "Email is required" }, { status: 400 });

        const [org, targetUser] = await Promise.all([
            prisma.organization.findUnique({ where: { id: orgId } }),
            prisma.user.findUnique({ where: { email } }),
        ]);

        if (!org)
            return NextResponse.json({ error: "Organization not found" }, { status: 404 });
        if (!targetUser)
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
                where: { badge: { userId: targetUser.id, orgId } },
            }),
            prisma.badge.deleteMany({
                where: { userId: targetUser.id, orgId },
            }),
        ]);

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
