/**
 * Prisma seed script — generates realistic dummy data for testing & analytics.
 *
 * Setup:
 *   npm install -D @faker-js/faker tsx
 *
 * Add to package.json:
 *   "prisma": { "seed": "tsx prisma/seed.ts" }
 *
 * Run:
 *   npx prisma db seed
 *   (or directly: npx tsx prisma/seed.ts)
 *
 * WARNING: This script wipes existing data in the affected tables before
 * seeding (see CLEANUP section). Do not run against production.
 */

import { PrismaClient, Role, Active, RequestStatus, TwoFactorPurpose } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// ---- Tunables --------------------------------------------------------
const NUM_ORGANIZATIONS = 6;
const USERS_PER_ORG_MIN = 8;
const USERS_PER_ORG_MAX = 20;
const EXTRA_UNAFFILIATED_USERS = 10; // users with no org, for edge-case testing
const MEALS_PER_ORG_MIN = 2;
const MEALS_PER_ORG_MAX = 4;
const READERS_PER_ORG_MIN = 1;
const READERS_PER_ORG_MAX = 3;
const ANNOUNCEMENTS_PER_ORG_MIN = 2;
const ANNOUNCEMENTS_PER_ORG_MAX = 6;
const SCAN_DAYS_BACK = 45; // spread scans over this many past days
const SCANS_PER_USER_PER_DAY_MAX = 2; // some users scan 0-2 times/day
const NOTIFICATIONS_TOTAL = 25;
const TWO_FACTOR_USER_FRACTION = 0.3; // ~30% of users have 2FA enabled

// ---- Helpers -----------------------------------------------------------
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

function pickSome<T>(arr: T[], min: number, max: number): T[] {
  const count = Math.min(arr.length, randInt(min, max));
  return faker.helpers.arrayElements(arr, count);
}

function randomPastDate(daysBack: number): Date {
  const now = Date.now();
  const past = now - randInt(0, daysBack) * 24 * 60 * 60 * 1000;
  const d = new Date(past);
  d.setHours(randInt(6, 21), randInt(0, 59), 0, 0);
  return d;
}

function randomTimeOnly(hour: number, minute = 0): Date {
  // Prisma @db.Time(0) columns just need a Date; only H:M:S is stored.
  return new Date(Date.UTC(1970, 0, 1, hour, minute, 0));
}

async function main() {
  // console.log('🌱 Seeding database...');

  // ---- CLEANUP (children first, respecting FKs) -------------------------
  // console.log('🧹 Cleaning existing data...');
  await prisma.badgeScan.deleteMany();
  await prisma.rfidReaders.deleteMany();
  await prisma.usersOnNotificationsRead.deleteMany();
  await prisma.usersOnNotifications.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.meal.deleteMany();
  await prisma.usersOnOrganizations.deleteMany();
  await prisma.twoFactorChallenge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  // ---- USERS --------------------------------------------------------
  // console.log('👤 Creating users...');
  const totalUsers =
    NUM_ORGANIZATIONS * USERS_PER_ORG_MAX + EXTRA_UNAFFILIATED_USERS; // upper bound pool

  const allUsers = [];
  for (let i = 0; i < totalUsers; i++) {
    const firstname = faker.person.firstName();
    const lastname = faker.person.lastName();
    const hasTwoFactor = Math.random() < TWO_FACTOR_USER_FRACTION;

    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        avatar: faker.image.avatar(),
        phoneNumber: faker.helpers.maybe(() => faker.phone.number(), { probability: 0.7 }),
        email: faker.internet.email({ firstName: firstname, lastName: lastname }).toLowerCase(),
        login: faker.helpers.maybe(() => faker.internet.username({ firstName: firstname, lastName: lastname }), {
          probability: 0.5,
        }),
        password: faker.internet.password({ length: 20 }), // pretend this is already hashed
        role: Math.random() < 0.1 ? Role.ADMIN : Role.USER,
        twoFactorEnabled: hasTwoFactor,
        twoFactorEmail: hasTwoFactor
          ? faker.helpers.maybe(() => faker.internet.email(), { probability: 0.3 })
          : null,
        createdAt: randomPastDate(180),
      },
    });

    
    allUsers.push(user);
  }
  // console.log(`   -> ${allUsers.length} users created`);

  // ---- ORGANIZATIONS --------------------------------------------------
  // console.log('🏢 Creating organizations...');
  const orgTypes = ['School', 'Company', 'University', 'Nonprofit', 'Gym'];
  const orgServices = ['Cafeteria', 'Canteen', 'Access Control', 'Meal Plan'];

  const organizations = [];

  for (let i = 0; i < NUM_ORGANIZATIONS; i++) {
    const orgUserCount = randInt(USERS_PER_ORG_MIN, USERS_PER_ORG_MAX);
    // Don't fully drain the pool — some users can belong to multiple orgs
    const members = pickSome(allUsers, Math.min(orgUserCount, allUsers.length), orgUserCount);
    const admin = pick(members);

    const org = await prisma.organization.create({
      data: {
        name: faker.company.name(),
        type: pick(orgTypes),
        service: pick(orgServices),
        badgeTimes: randInt(1, 3),
        active: Math.random() < 0.85 ? Active.TRUE : Active.FALSE,
        callBackURL: faker.helpers.maybe(() => faker.internet.url(), { probability: 0.4 }),
        createdAt: randomPastDate(300),
        users: { connect: members.map((u) => ({ id: u.id })) },
        admins: { connect: [{ id: admin.id }] },
      },
    });

    // Mirror into the explicit join table too (schema keeps both)
    await prisma.usersOnOrganizations.createMany({
      data: members.map((u) => ({ userId: u.id, orgId: org.id })),
      skipDuplicates: true,
    });

    organizations.push({ org, members, admin });
  }
  // console.log(`   -> ${organizations.length} organizations created`);

  // ---- BADGES (one per user, unique) -----------------------------------
  // console.log('🎫 Creating badges...');
  // Only give badges to users who belong to at least one org (realistic: badges are for org members)
  const orgMemberIds = new Set(organizations.flatMap((o) => o.members.map((u) => u.id)));
  const usersWithBadges = allUsers.filter((u) => orgMemberIds.has(u.id));

  const usedBadgeNumbers = new Set<string>();
  function uniqueBadgeNumber(): string {
    let n = faker.string.numeric(10);
    while (usedBadgeNumbers.has(n)) {
      n = faker.string.numeric(10);
    }
    usedBadgeNumbers.add(n);
    return n;
  }

  const badges = [];
  for (const user of usersWithBadges) {
    const badge = await prisma.badge.create({
      data: {
        number: uniqueBadgeNumber(),
        userId: user.id,
        createdAt: randomPastDate(180),
      },
    });
    badges.push(badge);
  }
  // console.log(`   -> ${badges.length} badges created`);

  // ---- MEALS --------------------------------------------------------
  // console.log('🍽️  Creating meals...');
  const mealTemplates = [
    { name: 'Breakfast', start: 7, end: 9 },
    { name: 'Lunch', start: 12, end: 14 },
    { name: 'Dinner', start: 18, end: 20 },
    { name: 'Snack', start: 16, end: 17 },
  ];

  const orgMeals: Record<number, any[]> = {};
  for (const { org } of organizations) {
    const mealCount = randInt(MEALS_PER_ORG_MIN, MEALS_PER_ORG_MAX);
    const chosen = faker.helpers.arrayElements(mealTemplates, mealCount);
    orgMeals[org.id] = [];
    for (const template of chosen) {
      const meal = await prisma.meal.create({
        data: {
          name: template.name,
          startTime: randomTimeOnly(template.start),
          endTime: randomTimeOnly(template.end),
          organizationId: org.id,
          createdAt: randomPastDate(300),
        },
      });
      orgMeals[org.id].push(meal);
    }
  }
  // console.log(`   -> ${Object.values(orgMeals).flat().length} meals created`);

  // ---- RFID READERS ---------------------------------------------------
  // console.log('📡 Creating RFID readers...');
  const locations = ['Main Entrance', 'Cafeteria Door', 'Side Gate', 'Library', 'Gym Entrance', 'Parking Lot'];
  const orgReaders: Record<number, any[]> = {};
  for (const { org } of organizations) {
    const readerCount = randInt(READERS_PER_ORG_MIN, READERS_PER_ORG_MAX);
    orgReaders[org.id] = [];
    for (let i = 0; i < readerCount; i++) {
      const reader = await prisma.rfidReaders.create({
        data: {
          location: pick(locations),
          organizationId: org.id,
        },
      });
      orgReaders[org.id].push(reader);
    }
  }
  // console.log(`   -> ${Object.values(orgReaders).flat().length} RFID readers created`);

  // ---- ANNOUNCEMENTS ---------------------------------------------------
  // console.log('📢 Creating announcements...');
  let announcementCount = 0;
  for (const { org, admin, members } of organizations) {
    const count = randInt(ANNOUNCEMENTS_PER_ORG_MIN, ANNOUNCEMENTS_PER_ORG_MAX);
    for (let i = 0; i < count; i++) {
      const author = Math.random() < 0.8 ? admin : pick(members);
      await prisma.announcement.create({
        data: {
          title: faker.lorem.sentence({ min: 3, max: 8 }),
          message: faker.lorem.paragraph(),
          organizationId: org.id,
          userId: author.id,
          createdAt: randomPastDate(120),
        },
      });
      announcementCount++;
    }
  }
  // console.log(`   -> ${announcementCount} announcements created`);

  // ---- BADGE SCANS (the analytics-rich table) --------------------------
  // console.log('📊 Creating badge scans...');
  const statusWeights: { status: RequestStatus; weight: number }[] = [
    { status: RequestStatus.ACCEPTED, weight: 75 },
    { status: RequestStatus.REJECTED, weight: 15 },
    { status: RequestStatus.PENDING, weight: 10 },
  ];

  function weightedStatus(): RequestStatus {
    const total = statusWeights.reduce((s, w) => s + w.weight, 0);
    let r = Math.random() * total;
    for (const w of statusWeights) {
      if (r < w.weight) return w.status;
      r -= w.weight;
    }
    return RequestStatus.ACCEPTED;
  }

  const badgeByUserId = new Map(badges.map((b) => [b.userId, b]));
  let scanCount = 0;
  const scanRows: {
    badgeId: string;
    rfidReaderID: number;
    mealId: number;
    status: RequestStatus;
    createdAt: Date;
  }[] = [];

  for (const { org, members } of organizations) {
    const meals = orgMeals[org.id];
    const readers = orgReaders[org.id];
    if (meals.length === 0 || readers.length === 0) continue;

    for (const user of members) {
      const badge = badgeByUserId.get(user.id);
      if (!badge) continue;

      for (let day = 0; day < SCAN_DAYS_BACK; day++) {
        // Not every user scans every day — simulate realistic attendance (~65%)
        if (Math.random() > 0.65) continue;

        const scansToday = randInt(1, SCANS_PER_USER_PER_DAY_MAX);
        for (let s = 0; s < scansToday; s++) {
          const meal = pick(meals);
          const reader = pick(readers);
          const daysAgo = day;
          const scanDate = new Date();
          scanDate.setDate(scanDate.getDate() - daysAgo);
          scanDate.setHours(randInt(6, 21), randInt(0, 59), randInt(0, 59), 0);

          scanRows.push({
            badgeId: badge.number,
            rfidReaderID: reader.id,
            mealId: meal.id,
            status: weightedStatus(),
            createdAt: scanDate,
          });
        }
      }
    }
  }

  // Batch insert for performance
  const BATCH_SIZE = 500;
  for (let i = 0; i < scanRows.length; i += BATCH_SIZE) {
    const batch = scanRows.slice(i, i + BATCH_SIZE);
    await prisma.badgeScan.createMany({ data: batch });
    scanCount += batch.length;
  }
  // console.log(`   -> ${scanCount} badge scans created`);

  // ---- NOTIFICATIONS ---------------------------------------------------
  // console.log('🔔 Creating notifications...');
  for (let i = 0; i < NOTIFICATIONS_TOTAL; i++) {
    const recipients = pickSome(allUsers, 1, 8);
    const readCount = randInt(0, recipients.length);
    const readUsers = recipients.slice(0, readCount);
    const unreadUsers = recipients.slice(readCount);

    const notif = await prisma.notification.create({
      data: {
        message: faker.lorem.sentence(),
        createdAt: randomPastDate(60),
        readUsers: { connect: readUsers.map((u) => ({ id: u.id })) },
        unreadUsers: { connect: unreadUsers.map((u) => ({ id: u.id })) },
      },
    });

    if (readUsers.length > 0) {
      await prisma.usersOnNotificationsRead.createMany({
        data: readUsers.map((u) => ({ userId: u.id, notifId: notif.id })),
        skipDuplicates: true,
      });
    }
    if (unreadUsers.length > 0) {
      await prisma.usersOnNotifications.createMany({
        data: unreadUsers.map((u) => ({ userId: u.id, notifId: notif.id })),
        skipDuplicates: true,
      });
    }
  }
  // console.log(`   -> ${NOTIFICATIONS_TOTAL} notifications created`);

  // ---- TWO-FACTOR CHALLENGES (history for 2FA-enabled users) ------------
  // console.log('🔐 Creating two-factor challenges...');
  const twoFactorUsers = allUsers.filter((u) => u.twoFactorEnabled);
  let challengeCount = 0;
  const purposes = [TwoFactorPurpose.LOGIN, TwoFactorPurpose.ENABLE, TwoFactorPurpose.DISABLE];

  for (const user of twoFactorUsers) {
    const historyCount = randInt(1, 5);
    for (let i = 0; i < historyCount; i++) {
      const createdAt = randomPastDate(90);
      const isConsumed = Math.random() < 0.8;
      await prisma.twoFactorChallenge.create({
        data: {
          userId: user.id,
          purpose: pick(purposes),
          codeHash: faker.string.alphanumeric(64),
          expiresAt: new Date(createdAt.getTime() + 10 * 60 * 1000),
          consumedAt: isConsumed
            ? new Date(createdAt.getTime() + randInt(30, 500) * 1000)
            : null,
          attempts: randInt(0, 3),
          resendCount: randInt(0, 2),
          lastSentAt: createdAt,
          createdAt,
        },
      });
      challengeCount++;
    }
  }
  // console.log(`   -> ${challengeCount} two-factor challenges created`);

  // console.log('✅ Seeding complete!');
  // console.log({
    users: allUsers.length,
    organizations: organizations.length,
    badges: badges.length,
    meals: Object.values(orgMeals).flat().length,
    rfidReaders: Object.values(orgReaders).flat().length,
    announcements: announcementCount,
    badgeScans: scanCount,
    notifications: NOTIFICATIONS_TOTAL,
    twoFactorChallenges: challengeCount,
  });
}

main()
  .catch((e) => {
    // console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });