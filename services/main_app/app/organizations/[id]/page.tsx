import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/sessionManage";
import { redirect } from "next/navigation";
import OrgDetails from "./client";

type Params = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ from?: string }>;
};

const isValidBackHref = (value?: string) => {
  if (!value) return false;
  return value.startsWith("/") && !value.startsWith("//");
};

export default async function ServerSide({ searchParams }: Params) {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const resolvedSearchParams = (await searchParams) ?? {};
  const backHref = isValidBackHref(resolvedSearchParams.from)
    ? resolvedSearchParams.from
    : "/organizations";

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
    });

    if (!user) {
      redirect("/auth/login");
    }

    const orgs = await prisma.organization.findMany({
      where: {
        users: { some: { id: session.id } },
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
          where: { id: session.id },
          select: { id: true },
        },
        _count: {
          select: { users: true },
        },
      },
    });

    const formattedOrgs = await Promise.all(
      orgs.map(async (o) => ({
        id: o.id,
        name: o.name,
        type: o.type,
        service: o.service,
        badgeTimes: o.badgeTimes,
        active: o.active,
        createdAt: o.createdAt,
        members: o._count.users,
        badges: await prisma.badge.count({
          where: { user: { orgs: { some: { id: o.id } } } },
        }),
        isOrgAdmin: o.admins.length > 0,
      })),
    );

    return <OrgDetails orgs={formattedOrgs} backHref={backHref} />;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    redirect("/dashboard");
  }
}
