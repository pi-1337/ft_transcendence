import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/sessionManage';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ id: string }> };

async function authorizeAdmin() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }/* IN_CASE_OF_BAD_IDEA , { status: 401 } IN_CASE_OF_BAD_IDEA */);
  }
  if (session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }/* IN_CASE_OF_BAD_IDEA , { status: 403 } IN_CASE_OF_BAD_IDEA */);
  }
  return null;
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const authError = await authorizeAdmin();
    if (authError) {
      return authError;
    }

    const { id: rawId } = await params;
    const userId = parseInt(rawId, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);
    }

    const { number } = await req.json();
    if (!number || !String(number).trim()) {
      return NextResponse.json({ error: 'Badge number is required' }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);
    }

    const badgeNumber = String(number).trim();
    if (badgeNumber.length > 50) {
      return NextResponse.json({ error: 'Badge number must be 50 characters or less' }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }/* IN_CASE_OF_BAD_IDEA , { status: 404 } IN_CASE_OF_BAD_IDEA */);
    }

    try {
      const badge = await prisma.badge.create({
        data: {
          number: badgeNumber,
          userId,
        },
        select: { number: true, createdAt: true },
      });

      return NextResponse.json({ success: true, badge }/* IN_CASE_OF_BAD_IDEA , { status: 201 } IN_CASE_OF_BAD_IDEA */);
    } catch (error: any) {
      if (error?.code === 'P2002') {
        return NextResponse.json({ error: 'Badge number already exists' }/* IN_CASE_OF_BAD_IDEA , { status: 409 } IN_CASE_OF_BAD_IDEA */);
      }
      throw error;
    }
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }/* IN_CASE_OF_BAD_IDEA , { status: 500 } IN_CASE_OF_BAD_IDEA */);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const authError = await authorizeAdmin();
    if (authError) {
      return authError;
    }

    const { id: rawId } = await params;
    const userId = parseInt(rawId, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);
    }

    const { number } = await req.json();
    if (!number || !String(number).trim()) {
      return NextResponse.json({ error: 'Badge number is required' }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);
    }

    const badgeNumber = String(number).trim();
    if (badgeNumber.length > 50) {
      return NextResponse.json({ error: 'Badge number must be 50 characters or less' }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);
    }

    const existingBadge = await prisma.badge.findFirst({
      where: { userId },
      select: { number: true },
    });

    if (!existingBadge) {
      return NextResponse.json({ error: 'User has no badge' }/* IN_CASE_OF_BAD_IDEA , { status: 404 } IN_CASE_OF_BAD_IDEA */);
    }

    try {
      const badge = await prisma.badge.update({
        where: { number: existingBadge.number },
        data: { number: badgeNumber },
        select: { number: true, createdAt: true },
      });

      return NextResponse.json({ success: true, badge }/* IN_CASE_OF_BAD_IDEA , { status: 200 } IN_CASE_OF_BAD_IDEA */);
    } catch (error: any) {
      if (error?.code === 'P2002') {
        return NextResponse.json({ error: 'Badge number already exists' }/* IN_CASE_OF_BAD_IDEA , { status: 409 } IN_CASE_OF_BAD_IDEA */);
      }
      throw error;
    }
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }/* IN_CASE_OF_BAD_IDEA , { status: 500 } IN_CASE_OF_BAD_IDEA */);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const authError = await authorizeAdmin();
    if (authError) {
      return authError;
    }

    const { id: rawId } = await params;
    const userId = parseInt(rawId, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);
    }

    const existingBadge = await prisma.badge.findFirst({
      where: { userId },
      select: { number: true },
    });

    if (!existingBadge) {
      return NextResponse.json({ error: 'User has no badge' }/* IN_CASE_OF_BAD_IDEA , { status: 404 } IN_CASE_OF_BAD_IDEA */);
    }

    await prisma.badge.delete({ where: { number: existingBadge.number } });

    return NextResponse.json({ success: true }/* IN_CASE_OF_BAD_IDEA , { status: 200 } IN_CASE_OF_BAD_IDEA */);
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }/* IN_CASE_OF_BAD_IDEA , { status: 500 } IN_CASE_OF_BAD_IDEA */);
  }
}
