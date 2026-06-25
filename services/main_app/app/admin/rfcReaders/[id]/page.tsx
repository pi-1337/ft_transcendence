import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";
import EditReaderForm from "./EditReaderForm";

interface Params
{
	params: Promise<{ id: string }>;
};

export default async function EditReaderPage({ params }: Params)
{
	// const session = await getSession();
	// if (!session)
	// 	redirect("/auth/login");
	// if (session.role !== "ADMIN")
	// 	redirect("/dashboard");

	// const { id: rawId } = await params;
	// const readerId = parseInt(rawId);
	// if (isNaN(readerId))
	// 	redirect("/admin/rfcReaders");

	// const [reader, organizations] = await Promise.all
	// ([
	// 	prisma.rfidReaders.findUnique
	// 	({
	// 		where: { id: readerId },
	// 		select: { id: true, location: true, organizationId: true },
	// 	}),
	// 	prisma.organization.findMany
	// 	({
	// 		select: { id: true, name: true },
	// 		orderBy: { name: "asc" },
	// 	}),
	// ]);
	// if (!reader)
	// 	redirect("/admin/rfcReaders");

	const demo_reader =
	{
		id: 101,
		location: "Main Entrance",
		organizationId: 1,
	};

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

	return (
		<EditReaderForm reader={demo_reader} organizations={demo_organizations} />
	);
}
