import { getSession } from "@/lib/sessionManage";
import Dashboard from "./client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@prisma/client";

export default async function ServerSide() {
  const session = await getSession();

  if (!session) redirect("/auth/login");

  //TODO
//   if (session.role === 'ADMIN')
//       redirect('/admin/dashboard');

  const { id } = session;
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      phoneNumber: true,
      role: true,
      avatar: true,
    },
  });

  if (!user) redirect("/auth/login");

  const totalOrganizations = await prisma.organization.count({
    where: {
      users: { some: { id } },
    },
  });

  const [badges, totalRecords] = await Promise.all([
    prisma.badge.findMany({
      where: {
        userId: id,
      },
    }),
    prisma.badgeScan.count({
      where:
        session.role === "ADMIN"
          ? {}
          : {
              badge: { userId: id },
            },
    }),
  ]);

  const unreadCount = await prisma.notification.count({
    where: {
      unreadUsers: { some: { id } },
    },
  });

  return (
    <Dashboard
      user={user}
      totalOrganizations={totalOrganizations}
      totalBadges={badges.length}
      totalRecords={totalRecords}
      unreadCount={unreadCount}
    />
  );
}
