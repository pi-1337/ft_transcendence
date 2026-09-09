import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/sessionManage';
import bcrypt from 'bcrypt';
import { randomBytes, randomInt } from 'crypto';
import { Prisma } from '@prisma/client';

const MAX_FILE_BYTES = 1024 * 1024;
const MAX_ROWS = 200;

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone: string) => /^\+[1-9]\d{7,14}$/.test(phone);

type ValidRow = {
  index: number;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string | null;
  role: 'USER' | 'ADMIN';
  orgId: number;
};

function generateBadgeNumber(): string {
  return String(randomInt(0, 10_000_000_000)).padStart(10, '0');
}

async function createBadgeWithRetry(tx: Prisma.TransactionClient, userId: number) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await tx.badge.create({
        data: { number: generateBadgeNumber(), userId },
        select: { number: true },
      });
    } catch (e) {
      if ((e as { code?: string }).code !== 'P2002') throw e;
    }
  }
  throw new Error('Could not allocate a unique badge number');
}

function parseJsonRows(text: string): Record<string, string>[]
{
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed)) throw new Error('JSON must be an array of objects');

  return parsed.map((r, i) => {
    if (typeof r !== 'object' || r === null || Array.isArray(r))
      throw new Error(`Item ${i + 1} is not an object`);
    return Object.fromEntries(
      Object.entries(r).map(([k, v]) => [k.trim().toLowerCase(), String(v ?? '').trim()]),
    );
  });
}

export async function POST(req: NextRequest)
{
    try
    {
        const session = await getSession();
        if (!session)
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (session.role !== 'ADMIN')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

        let form: FormData;
        try
        {
            form = await req.formData();
        }
        catch
        {
            return NextResponse.json({ error: 'Expected a multipart/form-data body' }, { status: 400 });
        }

        const file = form.get('file');
        if (!(file instanceof File))
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        if (file.size === 0)
            return NextResponse.json({ error: 'File is empty' }, { status: 400 });
        if (file.size > MAX_FILE_BYTES)
            return NextResponse.json({ error: 'File must be 1 MB or smaller' }, { status: 413 });
        
        const name = file.name.toLowerCase();
        if (!name.endsWith('.json'))
            return NextResponse.json({ error: 'Only .json files are accepted' }, { status: 415 });

        const text = await file.text();
        if (!text.trim())
            return NextResponse.json({ error: 'File is empty' }, { status: 400 });

        let rows: Record<string, string>[];
        try
        {
            rows = parseJsonRows(text);
        }
        catch (e)
        {
            return NextResponse.json({ error: e instanceof Error ? e.message : 'Could not parse the file' }, { status: 400 },);
        }

        if (rows.length === 0)
            return NextResponse.json({ error: 'File contains no data rows' }, { status: 400 });
        if (rows.length > MAX_ROWS)
            return NextResponse.json({ error: `At most ${MAX_ROWS} rows per import` }, { status: 400 });


        const valid: ValidRow[] = [];
        const failed: { item: number; email: string; error: string }[] = [];
        const seenEmails = new Set<string>();

        rows.forEach((r, i) => {
            const item = i + 1;
            const email = (r.email ?? '').toLowerCase();
            const reject = (error: string) => failed.push({ item, email: r.email ?? '', error });

            if (!r.firstname) return reject('firstname is required');
            if (!r.lastname) return reject('lastname is required');
            if (!validateEmail(email)) return reject('Invalid email format');
            if (r.phonenumber && !validatePhone(r.phonenumber)) return reject('Invalid phone number format');
            if (r.role && r.role !== 'USER' && r.role !== 'ADMIN') return reject('role must be USER or ADMIN');

            const orgId = parseInt(r.orgid ?? '', 10);
            if (isNaN(orgId) || orgId < 1) return reject('orgId must be a positive integer');

            if (seenEmails.has(email)) return reject('Duplicate email within the file');
            seenEmails.add(email);

            valid.push({
                index: item,
                firstname: r.firstname,
                lastname: r.lastname,
                email,
                phoneNumber: r.phonenumber || null,
                role: r.role === 'ADMIN' ? 'ADMIN' : 'USER',
                orgId,
            });
        });

        const orgIds = [...new Set(valid.map((v) => v.orgId))];
        const [orgs, existingUsers] = await Promise.all([
            prisma.organization.findMany({ where: { id: { in: orgIds } }, select: { id: true } }),
            prisma.user.findMany({ where: { email: { in: valid.map((v) => v.email) } }, select: { email: true } }),
        ]);

        const knownOrgs = new Set(orgs.map((o) => o.id));
        const takenEmails = new Set(existingUsers.map((u) => u.email.toLowerCase()));

        const ready = valid.filter((v) => {
            if (!knownOrgs.has(v.orgId)) {
                failed.push({ item: v.index, email: v.email, error: `Organization ${v.orgId} not found` });
                return false;
            }
            if (takenEmails.has(v.email)) {
                failed.push({ item: v.index, email: v.email, error: 'Email already in use' });
                return false;
            }
            return true;
        });

        const created: { item: number; email: string; badgeNumber: string; tempPassword: string }[] = [];

        for (const row of ready) {
            const tempPassword = randomBytes(12).toString('base64url');
            try {
                const passwordHash = await bcrypt.hash(tempPassword, 10);

                const badgeNumber = await prisma.$transaction(async (tx) => {
                const user = await tx.user.create({
                    data: {
                    firstname: row.firstname,
                    lastname: row.lastname,
                    email: row.email,
                    phoneNumber: row.phoneNumber,
                    password: passwordHash,
                    role: row.role,
                    orgs: { connect: { id: row.orgId } },
                    },
                    select: { id: true },
                });

                const badge = await createBadgeWithRetry(tx, user.id);
                return badge.number;
                });

                created.push({ item: row.index, email: row.email, badgeNumber, tempPassword });
            } catch (e) {
                const code = (e as { code?: string }).code;
                failed.push({
                item: row.index,
                email: row.email,
                error: code === 'P2002' ? 'Email already in use' : 'Could not create user',
                });
            }
        }

        return NextResponse.json(
        {
            success: failed.length === 0,
            summary: { total: rows.length, created: created.length, failed: failed.length },
            created,
            failed: failed.sort((a, b) => a.item - b.item),
        },
        { status: 200, headers: { 'Cache-Control': 'no-store' } },
        );


    }
    catch (error) {
        return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }
}