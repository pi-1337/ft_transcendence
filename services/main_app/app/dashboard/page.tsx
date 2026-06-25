
// import { getSession } from "@/lib/sessionManage";
import Dashboard from "./dashboard";
// import { redirect } from "next/navigation";
// import { prisma } from "@/lib/prisma";
// import { Badge } from "@prisma/client";

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
	// 	}
	// });

	// if (!user)
	// 	redirect("/auth/login");

	// const totalOrganizations = await prisma.organization.count
	// ({
	// 	where: { users: { some: { id } } }
	// });

	// const badges: Badge[] = await prisma.badge.findMany
	// ({
	// 	where: { userId: id }
	// });

	// const badgeNumbers = badges.map(b => b.number);
	// const totalRecords = await prisma.badgeRecord.count
	// ({
	// 	where: { badgeNumber: { in: badgeNumbers } }
	// });

	// const unreadCount = await prisma.notification.count
	// ({
	// 	where: { unreadUsers: { some: { id } } }
	// });

	const demo_user =
	{
		id: 1,
		firstname: "asmae",
		lastname: "mandour",
		email: "amandour@student.1337.ma",
		phoneNumber: "0613374220",
		role: "USER",
		avatar: null,
		twoFactorEnabled: false,
		twoFactorEmail: null
	};

	const total_organizations = 3;
	const total_badges = 5;
	const total_records = 12;
	const unread_count = 4;

	return (
		<Dashboard user={demo_user} totalOrganizations={total_organizations} totalBadges={total_badges} totalRecords={total_records} unreadCount={unread_count}/>
	);
}
