import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";
import OrgsTable from "./OrgsTable";
import { Active } from "@prisma/client";

export default async function AdminOrgsPage()
{
	// const session = await getSession();
	// if (!session)
	// 	redirect("/auth/login");
	// if (session.role !== "ADMIN")
	// 	redirect("/dashboard");

	// const orgs = await prisma.organization.findMany
	// ({
	// 	select:
	// 	{
	// 		id: true,
	// 		name: true,
	// 		type: true,
	// 		service: true,
	// 		active: true,
	// 		admins: { select: { id: true, firstname: true, lastname: true } },
	// 		_count: { select: { users: true } },
	// 		createdAt: true,
	// 	},
	// 	orderBy: { createdAt: "desc" },
	// });

	const demo_orgs =
	[
		{
			id: 1,
			name: "Tech Corp",
			type: "COMPANY",
			service: "Employee Access",
			active: "TRUE" as Active,
			admins:
			[
				{
					id: 1,
					firstname: "Ahmed",
					lastname: "Benali",
				},
			],
			_count: { users: 42, },
			createdAt: new Date("2026-06-20T10:00:00"),
		},
		{
			id: 2,
			name: "University Campus",
			type: "EDUCATION",
			service: "Student Meals",
			active: "TRUE" as Active,
			admins:
			[
				{
					id: 2,
					firstname: "Sara",
					lastname: "El Idrissi",
				},
				{
					id: 3,
					firstname: "Youssef",
					lastname: "Alaoui",
				},
			],
			_count: { users: 315, },
			createdAt: new Date("2026-06-18T14:30:00"),
		},
		{
			id: 3,
			name: "Health Center",
			type: "HEALTHCARE",
			service: "Staff Access",
			active: "FALSE" as Active,
			admins:
			[
				{
					id: 4,
					firstname: "Fatima",
					lastname: "Zahra",
				},
			],
			_count: { users: 18, },
			createdAt: new Date("2026-06-15T09:15:00"),
		},
	];

	return (
		<OrgsTable orgs={demo_orgs} />
	);
}
