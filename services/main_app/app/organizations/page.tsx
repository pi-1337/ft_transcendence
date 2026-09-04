import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/sessionManage";
import { OrgsFrontend } from "@/lib/types";
import { redirect } from "next/navigation";
import Organizations from "./client";

export default async function ServerSide() {
  const session = await getSession();

  if (!session) redirect("/auth/login");

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
    },
  });

  if (!user) redirect("/auth/login");

  const rawOrgs = await prisma.organization.findMany({
    where: {
      users: { some: { id } },
    },
    select: {
      id: true,
      name: true,
      type: true,
      service: true,
      badgeTimes: true,
      active: true,
      createdAt: true,
      admins: {
        where: { id },
        select: { id: true },
      },
    },
  });
  const orgs = rawOrgs.map(org => ({
        id: org.id,
        name: org.name,
        type: org.type,
        service: org.service,
        badgeTimes: org.badgeTimes,
        active: org.active,
        createdAt: org.createdAt,
        isAdmin: org.admins.length > 0
    }));

  return <Organizations orgs={orgs} />;
}
