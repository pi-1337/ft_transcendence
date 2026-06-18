import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/sessionManage';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ id: string }> };

async function authorizeAdmin() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const { number } = await req.json();
    if (!number || !String(number).trim()) {
      return NextResponse.json({ error: 'Badge number is required' }, { status: 400 });
    }

    const badgeNumber = String(number).trim();
    if (badgeNumber.length > 50) {
      return NextResponse.json({ error: 'Badge number must be 50 characters or less' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    try {
      const badge = await prisma.badge.create({
        data: {
          number: badgeNumber,
          userId,
        },
        select: { number: true, createdAt: true },
      });

      return NextResponse.json({ success: true, badge }, { status: 201 });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        return NextResponse.json({ error: 'Badge number already exists' }, { status: 409 });
      }
      throw error;
    }
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
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
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const { number } = await req.json();
    if (!number || !String(number).trim()) {
      return NextResponse.json({ error: 'Badge number is required' }, { status: 400 });
    }

    const badgeNumber = String(number).trim();
    if (badgeNumber.length > 50) {
      return NextResponse.json({ error: 'Badge number must be 50 characters or less' }, { status: 400 });
    }

    const existingBadge = await prisma.badge.findFirst({
      where: { userId },
      select: { number: true },
    });

    if (!existingBadge) {
      return NextResponse.json({ error: 'User has no badge' }, { status: 404 });
    }

    try {
      const badge = await prisma.badge.update({
        where: { number: existingBadge.number },
        data: { number: badgeNumber },
        select: { number: true, createdAt: true },
      });

      return NextResponse.json({ success: true, badge }, { status: 200 });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        return NextResponse.json({ error: 'Badge number already exists' }, { status: 409 });
      }
      throw error;
    }
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
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
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const existingBadge = await prisma.badge.findFirst({
      where: { userId },
      select: { number: true },
    });

    if (!existingBadge) {
      return NextResponse.json({ error: 'User has no badge' }, { status: 404 });
    }

    await prisma.badge.delete({ where: { number: existingBadge.number } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
