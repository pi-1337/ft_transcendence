import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";
import ReadersTable from "./ReadersTable";

export default async function AdminRfcReadersPage()
{
	// const session = await getSession();
	// if (!session)
	// 	redirect("/auth/login");
	// if (session.role !== "ADMIN")
	// 	redirect("/dashboard");

	// const readers = await prisma.rfidReaders.findMany
	// ({
	// 	select:
	// 	{
	// 		id: true,
	// 		location: true,
	// 		organizationId: true,
	// 		organization: { select: { name: true } },
	// 	},
	// 	orderBy: { id: "desc" },
	// });

	const demo_readers = 
	[
		{
			id: 101,
			location: "Main Entrance",
			organizationId: 1,
			organization: { name: "Tech Corp", },
		},
		{
			id: 102,
			location: "Cafeteria Gate",
			organizationId: 1,
			organization: { name: "Tech Corp", },
		},
		{
			id: 103,
			location: "Library Entrance",
			organizationId: 2,
			organization: { name: "University Campus", },
		},
		{
			id: 104,
			location: "Staff Entrance",
			organizationId: 3,
			organization: { name: "Health Center", },
		},
	];

	return (
		<ReadersTable readers={demo_readers} />
	);
}
