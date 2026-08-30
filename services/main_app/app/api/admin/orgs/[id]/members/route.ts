import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
    try {
        const session = await getSession();

        if (!session)
            return NextResponse.json({ error: "Unauthorized" }/* IN_CASE_OF_BAD_IDEA , { status: 401 } IN_CASE_OF_BAD_IDEA */);
        if (session.role !== 'ADMIN')
            return NextResponse.json({ error: "Forbidden" }/* IN_CASE_OF_BAD_IDEA , { status: 403 } IN_CASE_OF_BAD_IDEA */);

        const { id: rawId } = await params;
        const orgId = parseInt(rawId);
        if (isNaN(orgId))
            return NextResponse.json({ error: "Invalid organization ID" }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

        const { email } = await req.json();
        if (!email)
            return NextResponse.json({ error: "Email is required" }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

        const [org, user] = await Promise.all([
            prisma.organization.findUnique({ where: { id: orgId } }),
            prisma.user.findUnique({ where: { email } }),
        ]);

        if (!org)
            return NextResponse.json({ error: "Organization not found" }/* IN_CASE_OF_BAD_IDEA , { status: 404 } IN_CASE_OF_BAD_IDEA */);
        if (!user)
            return NextResponse.json({ error: "No user found with that email" }/* IN_CASE_OF_BAD_IDEA , { status: 404 } IN_CASE_OF_BAD_IDEA */);

        const alreadyMember = await prisma.organization.findFirst({
            where: { id: orgId, users: { some: { email } } },
        });

        if (alreadyMember)
            return NextResponse.json({ error: "User is already a member of this organization" }/* IN_CASE_OF_BAD_IDEA , { status: 409 } IN_CASE_OF_BAD_IDEA */);

        await prisma.user.update({
            where: { email },
            data: { orgs: { connect: { id: orgId } } },
        });

        return NextResponse.json({
            success: true,
            user: { id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email },
        }/* IN_CASE_OF_BAD_IDEA , { status: 200 } IN_CASE_OF_BAD_IDEA */);

    } catch (error) {
        // console.error(error);
        return NextResponse.json({ error: "Something went wrong" }/* IN_CASE_OF_BAD_IDEA , { status: 500 } IN_CASE_OF_BAD_IDEA */);
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    try {
        const session = await getSession();

        if (!session)
            return NextResponse.json({ error: "Unauthorized" }/* IN_CASE_OF_BAD_IDEA , { status: 401 } IN_CASE_OF_BAD_IDEA */);
        if (session.role !== 'ADMIN')
            return NextResponse.json({ error: "Forbidden" }/* IN_CASE_OF_BAD_IDEA , { status: 403 } IN_CASE_OF_BAD_IDEA */);

        const { id: rawId } = await params;
        const orgId = parseInt(rawId);
        if (isNaN(orgId))
            return NextResponse.json({ error: "Invalid organization ID" }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

        const { email } = await req.json();
        if (!email)
            return NextResponse.json({ error: "Email is required" }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);

        const [org, user] = await Promise.all([
            prisma.organization.findUnique({ where: { id: orgId } }),
            prisma.user.findUnique({ where: { email } }),
        ]);

        if (!org)
            return NextResponse.json({ error: "Organization not found" }/* IN_CASE_OF_BAD_IDEA , { status: 404 } IN_CASE_OF_BAD_IDEA */);
        if (!user)
            return NextResponse.json({ error: "No user found with that email" }/* IN_CASE_OF_BAD_IDEA , { status: 404 } IN_CASE_OF_BAD_IDEA */);

        const isMember = await prisma.organization.findFirst({
            where: { id: orgId, users: { some: { email } } },
        });

        if (!isMember)
            return NextResponse.json({ error: "User is not a member of this organization" }/* IN_CASE_OF_BAD_IDEA , { status: 404 } IN_CASE_OF_BAD_IDEA */);

        await prisma.organization.update({
            where: { id: orgId },
            data: {
                users: { disconnect: { email } },
                admins: { disconnect: { email } },
            },
        });

        return NextResponse.json({ success: true }/* IN_CASE_OF_BAD_IDEA , { status: 200 } IN_CASE_OF_BAD_IDEA */);

    } catch (error) {
        // console.error(error);
        return NextResponse.json({ error: "Something went wrong" }/* IN_CASE_OF_BAD_IDEA , { status: 500 } IN_CASE_OF_BAD_IDEA */);
    }
}
