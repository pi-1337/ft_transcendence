import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/sessionManage";
import { redirect } from "next/navigation";
import Settings from "./settings";

export default async function ServerSide()
{
	// const session = await getSession();
	// if (!session)
	// 	redirect("/auth/login");
	// if (session.role === "ADMIN")
	// 	redirect("/admin/dashboard");

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
	// 		role: true,
	// 		avatar: true,
	// 		twoFactorEnabled: true,
	// 		twoFactorEmail: true,
	// 	}
	// });
	// if (!user)
	// 	redirect("/auth/login");

	const demo_user =
	{
		id: 1,
		firstname: "Asmae",
		lastname: "Mandour",
		email: "asmae@example.com",
		phoneNumber: "+212600000000",
		role: "USER",
		avatar: "https://avatars.githubusercontent.com/u/145014607?v=4",

		twoFactorEnabled: true,
		twoFactorEmail: "ahmed.2fa@example.com",
	};

	return (
		<Settings user={demo_user}/>
	);
}
