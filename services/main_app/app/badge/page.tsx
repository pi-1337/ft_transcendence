import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";
import BadgeManagerClient from "./BadgeManagerClient";

export default async function BadgePage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const organizations = await prisma.organization.findMany({
    select: {
      id: true,
      name: true,
      type: true,
      service: true,
      active: true,
    },
    orderBy: { name: "asc" },
  });

  return <BadgeManagerClient organizations={organizations} />;
}
