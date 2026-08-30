import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/sessionManage';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ id: string }> };

function parseOrgId(rawId: string) {
  const orgId = parseInt(rawId, 10);
  if (isNaN(orgId)) {
    return null;
  }
  return orgId;
}

function parseTimeToDate(value: string) {
  const trimmed = value.trim();
  const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(trimmed);
  if (!match) {
    return null;
  }

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const seconds = parseInt(match[3] ?? '0', 10);

  if (hours > 23 || minutes > 59 || seconds > 59) {
    return null;
  }

  const date = new Date(Date.UTC(1970, 0, 1, hours, minutes, seconds));
  return date;
}

function toMinutes(value: string) {
  const match = /^(\d{2}):(\d{2})(?::\d{2})?$/.exec(value.trim());
  if (!match) {
    return null;
  }
  return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
}

function formatMeal(meal: { id: number; name: string; startTime: Date; endTime: Date }) {
  return {
    id: meal.id,
    name: meal.name,
    startTime: meal.startTime.toISOString(),
    endTime: meal.endTime.toISOString(),
  };
}

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
    const orgId = parseOrgId(rawId);
    if (!orgId) {
      return NextResponse.json({ error: 'Invalid organization ID' }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);
    }

    const { name, startTime, endTime } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Meal name is required' }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);
    }
    if (!startTime || !endTime) {
      return NextResponse.json({ error: 'startTime and endTime are required' }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);
    }

    const startAt = parseTimeToDate(String(startTime));
    const endAt = parseTimeToDate(String(endTime));

    if (!startAt || !endAt) {
      return NextResponse.json({ error: 'Time must be in HH:MM or HH:MM:SS format' }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);
    }

    const startMinutes = toMinutes(String(startTime));
    const endMinutes = toMinutes(String(endTime));
    if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
      return NextResponse.json({ error: 'endTime must be after startTime' }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);
    }

    const org = await prisma.organization.findUnique({ where: { id: orgId } });
    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }/* IN_CASE_OF_BAD_IDEA , { status: 404 } IN_CASE_OF_BAD_IDEA */);
    }

    const meal = await prisma.meal.create({
      data: {
        name: String(name).trim(),
        startTime: startAt,
        endTime: endAt,
        organizationId: orgId,
      },
      select: { id: true, name: true, startTime: true, endTime: true },
    });

    return NextResponse.json({ success: true, meal: formatMeal(meal) }/* IN_CASE_OF_BAD_IDEA , { status: 201 } IN_CASE_OF_BAD_IDEA */);
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
    const orgId = parseOrgId(rawId);
    if (!orgId) {
      return NextResponse.json({ error: 'Invalid organization ID' }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);
    }

    const { mealId, name, startTime, endTime } = await req.json();
    const parsedMealId = parseInt(String(mealId), 10);

    if (isNaN(parsedMealId)) {
      return NextResponse.json({ error: 'Valid mealId is required' }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);
    }

    if (!name || !String(name).trim() || !startTime || !endTime) {
      return NextResponse.json({ error: 'name, startTime, and endTime are required' }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);
    }

    const startAt = parseTimeToDate(String(startTime));
    const endAt = parseTimeToDate(String(endTime));

    if (!startAt || !endAt) {
      return NextResponse.json({ error: 'Time must be in HH:MM or HH:MM:SS format' }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);
    }

    const startMinutes = toMinutes(String(startTime));
    const endMinutes = toMinutes(String(endTime));
    if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
      return NextResponse.json({ error: 'endTime must be after startTime' }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);
    }

    const meal = await prisma.meal.findFirst({
      where: { id: parsedMealId, organizationId: orgId },
      select: { id: true },
    });

    if (!meal) {
      return NextResponse.json({ error: 'Meal not found for this organization' }/* IN_CASE_OF_BAD_IDEA , { status: 404 } IN_CASE_OF_BAD_IDEA */);
    }

    const updatedMeal = await prisma.meal.update({
      where: { id: parsedMealId },
      data: {
        name: String(name).trim(),
        startTime: startAt,
        endTime: endAt,
      },
      select: { id: true, name: true, startTime: true, endTime: true },
    });

    return NextResponse.json({ success: true, meal: formatMeal(updatedMeal) }/* IN_CASE_OF_BAD_IDEA , { status: 200 } IN_CASE_OF_BAD_IDEA */);
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
    const orgId = parseOrgId(rawId);
    if (!orgId) {
      return NextResponse.json({ error: 'Invalid organization ID' }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);
    }

    const { mealId } = await req.json();
    const parsedMealId = parseInt(String(mealId), 10);

    if (isNaN(parsedMealId)) {
      return NextResponse.json({ error: 'Valid mealId is required' }/* IN_CASE_OF_BAD_IDEA , { status: 400 } IN_CASE_OF_BAD_IDEA */);
    }

    const meal = await prisma.meal.findFirst({
      where: { id: parsedMealId, organizationId: orgId },
      select: { id: true },
    });

    if (!meal) {
      return NextResponse.json({ error: 'Meal not found for this organization' }/* IN_CASE_OF_BAD_IDEA , { status: 404 } IN_CASE_OF_BAD_IDEA */);
    }

    await prisma.meal.delete({ where: { id: parsedMealId } });

    return NextResponse.json({ success: true }/* IN_CASE_OF_BAD_IDEA , { status: 200 } IN_CASE_OF_BAD_IDEA */);
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }/* IN_CASE_OF_BAD_IDEA , { status: 500 } IN_CASE_OF_BAD_IDEA */);
  }
}
