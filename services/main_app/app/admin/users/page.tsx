import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";
import UsersTable from "./UsersTable";

export default async function AdminUsersPage()
{
	// const session = await getSession();
	// if (!session)
	// 	redirect("/auth/login");
	// if (session.role !== "ADMIN")
	// 	redirect("/dashboard");

	// const users = await prisma.user.findMany
	// ({
	// 	select:
	// 	{
	// 		id: true,
	// 		firstname: true,
	// 		lastname: true,
	// 		email: true,
	// 		role: true,
	// 		createdAt: true,
	// 	},
	// 	orderBy: { createdAt: "desc" },
	// });

	const demo_users =
	[
		{
			id: 3,
			firstname: "Ahmed",
			lastname: "Benali",
			email: "ahmed@example.com",
			role: "ADMIN",
			createdAt: new Date("2026-06-24T10:00:00"),
		},
		{
			id: 2,
			firstname: "Sara",
			lastname: "El Idrissi",
			email: "sara@example.com",
			role: "USER",
			createdAt: new Date("2026-06-23T15:30:00"),
		},
		{
			id: 1,
			firstname: "Asmae",
			lastname: "Mandour",
			email: "asmea@example.com",
			role: "ADMIN",
			createdAt: new Date("2026-06-22T09:45:00"),
		},
		{
			id: 4,
			firstname: "Fatima",
			lastname: "Zahra",
			email: "fatima@example.com",
			role: "USER",
			createdAt: new Date("2026-06-20T14:20:00"),
		},
	];
	const demo_current_admin_id = 1;

	return (
		<UsersTable users={demo_users} currentAdminId={demo_current_admin_id} />
	);
}
