import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";
import CreateReaderForm from "./CreateReaderForm";

export default async function CreateReaderPage()
{
	// const session = await getSession();
	// if (!session)
	// 	redirect("/auth/login");
	// if (session.role !== "ADMIN")
	// 	redirect("/dashboard");

	// const organizations = await prisma.organization.findMany
	// ({
	// 	select: { id: true, name: true },
	// 	orderBy: { name: "asc" },
	// });

	const demo_organizations =
	[
		{
			id: 1,
			name: "Tech Corp",
		},
		{
			id: 2,
			name: "University Campus",
		},
		{
			id: 3,
			name: "Health Center",
		},
		{
			id: 4,
			name: "Research Institute",
		},
	];

	return <CreateReaderForm organizations={demo_organizations} />;
}
