import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";
import EditOrgForm from "./EditOrgForm";
import { Active } from "@prisma/client";

interface Params
{
	params: Promise<{ id: string }>;
};

export default async function EditOrgPage({ params }: Params)
{
	// const session = await getSession();
	// if (!session)
	// 	redirect("/auth/login");
	// if (session.role !== "ADMIN")
	// 	redirect("/dashboard");

	// const { id: rawId } = await params;
	// const orgId = parseInt(rawId);
	// if (isNaN(orgId))
	// 	redirect("/admin/orgs");

	// const org = await prisma.organization.findUnique
	// ({
	// 	where: { id: orgId },
	// 	include:
	// 	{
	// 		users: { select: { id: true, firstname: true, lastname: true, email: true } },
	// 		admins: { select: { id: true, firstname: true, lastname: true, email: true } },
	// 		meals:
	// 		{
	// 			select: { id: true, name: true, startTime: true, endTime: true },
	// 			orderBy: { startTime: "asc" },
	// 		},
	// 	},
	// });
	// if (!org)
	// 	redirect("/admin/orgs");

	const demo_org =
	{
		id: 1,
		name: "Tech Corp",
		type: "Company",
		service: "IT Services",
		badgeTimes: 120,
		active: "ACTIVE" as Active,
		callBackURL: null,

		users:
		[
			{
				id: 1,
				firstname: "Ahmed",
				lastname: "Benali",
				email: "ahmed@example.com",
			},
			{
				id: 2,
				firstname: "Sara",
				lastname: "El Idrissi",
				email: "sara@example.com",
			},
		],

		admins:
		[
			{
				id: 1,
				firstname: "Ahmed",
				lastname: "Benali",
				email: "ahmed@example.com",
			},
		],

		meals:
		[
			{
				id: 1,
				name: "Breakfast",
				startTime: new Date("2026-06-24T08:00:00"),
				endTime: new Date("2026-06-24T10:00:00"),
			},
			{
				id: 2,
				name: "Lunch",
				startTime: new Date("2026-06-24T12:00:00"),
				endTime: new Date("2026-06-24T14:00:00"),
			},
			{
				id: 3,
				name: "Dinner",
				startTime: new Date("2026-06-24T18:00:00"),
				endTime: new Date("2026-06-24T20:00:00"),
			},
		],
	};

	return (
		<EditOrgForm org={demo_org}/>
	);
}
