import { getSession } from "@/lib/sessionManage";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Notification } from "@prisma/client";
import Notifications from "./notifications";

export default async function ServerSide()
{
	// const session = await getSession();
	// if (!session)
	// 	redirect("/auth/login");
	// if (session.role === "ADMIN")
	// 	redirect("/admin/dashboard");

	// const { id } = session;
	// const user = await prisma.user.findUnique({ where: { id }, });
	// if (!user)
	// 	redirect("/auth/login");

	// const unreadNotifications: Notification[] = await prisma.notification.findMany
	// ({
	// 	where: { unreadUsers: { some: { id } } }
	// });
	// const readNotifications: Notification[] = await prisma.notification.findMany
	// ({
	// 	where: { readUsers: { some: { id } } }
	// });

	// const notifications =
	// [
	// 	...unreadNotifications.map(n => ({ id: n.id, read: false, message: n.message, createdAt: n.createdAt })),
	// 	...readNotifications.map(n => ({ id: n.id, read: true, message: n.message, createdAt: n.createdAt }))
	// ];

	const demo_notifications =
	[
		{
			id: 1,
			read: false,
			message: "Your badge scan was accepted",
			createdAt: new Date("2026-06-24T10:15:00"),
		},
		{
			id: 2,
			read: false,
			message: "New organization invitation received",
			createdAt: new Date("2026-06-24T09:40:00"),
		},
		{
			id: 3,
			read: true,
			message: "Password changed successfully",
			createdAt: new Date("2026-06-23T18:20:00"),
		},
		{
			id: 4,
			read: true,
			message: "Meal schedule updated",
			createdAt: new Date("2026-06-22T12:00:00"),
		},
	];

	return (
		<Notifications notifications={demo_notifications}/>
	);
}
