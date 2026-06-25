import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";
import EditUserForm from "./EditUserForm";

interface Params
{
	params: Promise<{ id: string }>;
};

export default async function EditUserPage({ params }: Params)
{
	// const session = await getSession();
	// if (!session)
	// 	redirect("/auth/login");
	// if (session.role !== "ADMIN")
	// 	redirect("/dashboard");

	// const { id: rawId } = await params;
	// const userId = parseInt(rawId);
	// if (isNaN(userId))
	// 	redirect("/admin/users");

	// const user = await prisma.user.findUnique
	// ({
	// 	where: { id: userId },
	// 	select:
	// 	{
	// 		id: true,
	// 		firstname: true,
	// 		lastname: true,
	// 		email: true,
	// 		phoneNumber: true,
	// 		role: true,
	// 		badge: { select: { number: true, createdAt: true } },
	// 	},
	// });
	// if (!user)
	// 	redirect("/admin/users");

	// const userForForm = { ...user, phoneNumber: user.phoneNumber ?? "", };

	const demo_user_for_form =
	{
		id: 7,
		firstname: "Asmae",
		lastname: "Mandour",
		email: "asmae@1337.com",
		phoneNumber: "+21244556677",
		role: "ADMIN",
		badge:
		{
			number: "BADGE-2026-001",
			createdAt: new Date("2026-01-15T09:30:00"),
		},
	};
	const demo_is_self = false;

	return (
		<EditUserForm user={demo_user_for_form} isSelf={demo_is_self}/>
	);
}
