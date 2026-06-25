import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";
import AnnouncementsClient from "./AnnouncementsClient";

export default async function AdminAnnouncementsPage()
{
	// const session = await getSession();
	// if (!session)
	// 	redirect("/auth/login");
	// if (session.role !== "ADMIN")
	// 	redirect("/dashboard");

	// const [organizations, announcements] = await Promise.all
	// ([
	// 	prisma.organization.findMany
	// 	({
	// 		select:
	// 		{
	// 			id: true,
	// 			name: true,
	// 		},
	// 		orderBy: { name: "asc", },
	// 	}),
	// 	prisma.announcement.findMany
	// 	({
	// 		select:
	// 		{
	// 			id: true,
	// 			title: true,
	// 			message: true,
	// 			createdAt: true,
	// 			updatedAt: true,
	// 			organization: 
	// 			{
	// 				select:
	// 				{
	// 					id: true,
	// 					name: true,
	// 				},
	// 			},
	// 			createdBy:
	// 			{
	// 				select:
	// 				{
	// 					id: true,
	// 					firstname: true,
	// 					lastname: true,
	// 					email: true,
	// 				},
	// 			},
	// 		},
	// 		orderBy: { createdAt: "desc", },
	// 	}),
	// ]);

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
	];

	const demo_announcements =
	[
		{
			id: 1,
			title: "System Maintenance",
			message: "The platform will be unavailable tonight from 23:00 to 01:00.",
			createdAt: new Date("2026-06-24T10:00:00"),
			updatedAt: new Date("2026-06-24T10:00:00"),
			organization:
			{
				id: 1,
				name: "Tech Corp",
			},
			createdBy:
			{
				id: 1,
				firstname: "Asmea",
				lastname: "Mandour",
				email: "asmea@admin.com",
			},
		},
		{
			id: 2,
			title: "New Badge Policy",
			message: "All employees must renew their badges before the end of the month.",
			createdAt: new Date("2026-06-23T14:30:00"),
			updatedAt: new Date("2026-06-23T15:00:00"),
			organization:
			{
				id: 2,
				name: "University Campus",
			},
			createdBy:
			{
				id: 2,
				firstname: "Sara",
				lastname: "El Idrissi",
				email: "sara@example.com",
			},
		},
		{
			id: 3,
			title: "New RFID Readers Installed",
			message: "Additional readers have been deployed at the main entrance.",
			createdAt: new Date("2026-06-22T09:15:00"),
			updatedAt: new Date("2026-06-22T09:15:00"),
			organization:
			{
				id: 3,
				name: "Health Center",
			},
			createdBy:
			{
				id: 1,
				firstname: "Ahmed",
				lastname: "Benali",
				email: "admin@example.com",
			},
		},
	];

	return (
		<AnnouncementsClient organizations={demo_organizations} announcements={demo_announcements} />
	);
}
