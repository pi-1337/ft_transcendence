import { Active } from "@prisma/client";

// import { prisma } from "@/lib/prisma";
// import { getSession } from "@/lib/sessionManage";
// import { redirect } from "next/navigation";
import { OrgsFrontend } from "@/lib/types";
import Organizations from "./organizations";

export default async function ServerSide()
{
	// const session = await getSession();
	// if (!session)
	// 	redirect("/auth/login");

	// const { id } = session;
	// const user = await prisma.user.findUnique
	// ({
	// 	where: { id },
	// 	select:
	// 	{
	// 		id: true,
	// 		firstname: true,
	// 		lastname: true,
	// 		email: true,
	// 		phoneNumber: true,
	// 		role: true
	// 	}
	// });
	// if (!user)
	// 	redirect("/auth/login");

	// const orgs: OrgsFrontend[] = await prisma.organization.findMany
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
	// 		createdAt: true
	// 	}
	// });

	const demo_orgs: OrgsFrontend[] =
	[
		{
			id: 1,
			name: "Tech Corp",
			type: "Company",
			service: "IT Services",
			badgeTimes: 120,
			active: "ACTIVE" as Active,
			createdAt: new Date("2024-01-10T10:00:00Z"),
		},
		{
			id: 2,
			name: "Health Center",
			type: "Hospital",
			service: "Healthcare",
			badgeTimes: 85,
			active: "INACTIVE" as Active,
			createdAt: new Date("2023-11-05T08:30:00Z"),
		},
		{
			id: 3,
			name: "Edu Platform",
			type: "Education",
			service: "Learning",
			badgeTimes: 240,
			active: "ACTIVE" as Active,
			createdAt: new Date("2025-02-15T14:20:00Z"),
		},
	];

	return (
		<Organizations orgs={demo_orgs}/>
	);
}
