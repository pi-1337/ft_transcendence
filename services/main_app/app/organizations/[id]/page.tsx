// import { prisma } from "@/lib/prisma";
// import { getSession } from "@/lib/sessionManage";
// import { redirect } from "next/navigation";
import OrgDetails from "./details";

export default async function ServerSide()
{
	// const session = await getSession();
	// if (!session)
	// 	redirect("/auth/login");

	// const { id } = session;
	try
	{
		// const user = await prisma.user.findUnique({ where: { id } });
		// if (!user)
		// 	redirect("/auth/login");

		// const orgs = await prisma.organization.findMany
		// ({
		// 	where: { users: { some: { id } } },
		// 	select:
		// 	{
		// 		id: true,
		// 		name: true,
		// 		type: true,
		// 		service: true,
		// 		badgeTimes: true,
		// 		active: true,
		// 		createdAt: true,
		// 		admins:
		// 		{
		// 			where: { id },
		// 			select: { id: true },
		// 		},
		// 	}
		// });
		// const formatted_orgs = await Promise.all
		// (
		// 	orgs.map(async (o: (typeof orgs)[number]) =>
		// 	({
		// 		id: o.id,
		// 		name: o.name,
		// 		type: o.type,
		// 		service: o.service,
		// 		badgeTimes: o.badgeTimes,
		// 		active: o.active,
		// 		createdAt: o.createdAt,
		// 		members: await prisma.user.count({ where: { orgs: { some: { id: o.id } } } }) as number,
		// 		badges: await prisma.badge.count({ where: { user: { orgs: { some: { id: o.id } } } } }) as number,
		// 		isOrgAdmin: o.admins.length > 0,
		// 	}))
		// );

		const demo_orgs =
		[
  			{
				id: 1,
				name: "Tech Corp",
				type: "Company",
				service: "IT Services",
				badgeTimes: 120,
				active: "ACTIVE",
				createdAt: new Date("2024-01-10T10:00:00Z"),
				members: 45,
				badges: 320,
				isOrgAdmin: true,
			},
  			{
				id: 2,
				name: "Health Center",
				type: "Hospital",
				service: "Healthcare",
				badgeTimes: 85,
				active: "INACTIVE",
				createdAt: new Date("2023-11-05T08:30:00Z"),
				members: 18,
				badges: 97,
				isOrgAdmin: false,
			},
  			{
				id: 3,
				name: "Edu Platform",
				type: "Education",
				service: "Learning",
				badgeTimes: 240,
				active: "ACTIVE",
				createdAt: new Date("2025-02-15T14:20:00Z"),
				members: 120,
				badges: 560,
				isOrgAdmin: true,
			},
		];

		return (
			<OrgDetails orgs={demo_orgs}/>
		);
	}
	catch (error)
	{
		// if ((error as any)?.digest?.startsWith("NEXT_REDIRECT"))
		// 	throw error;
		// console.error("Failed to load organizations:", error);
		// redirect("/dashboard");
	}
}
