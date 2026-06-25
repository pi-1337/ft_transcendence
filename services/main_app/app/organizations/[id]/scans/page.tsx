import { redirect } from "next/navigation";
// import { getSession } from "@/lib/sessionManage";
// import { prisma } from "@/lib/prisma";
// import { RequestStatus } from "@prisma/client";
import ScansClient from "./ScansClient";

interface Params
{ 
	params: Promise<{ id: string }>;
};

export default async function OrgScansPage({ params }: Params)
{
	// const session = await getSession();
	// if (!session)
	// 	redirect("/auth/login");

	// const { id: rawId } = await params;
	// const orgId = parseInt(rawId, 10);
	// if (isNaN(orgId))
	// 	redirect("/organizations");

	// const org = await prisma.organization.findFirst
	// ({
	// 	where:
	// 	{
	// 		id: orgId,
	// 		admins: { some: { id: session.id } },
	// 	},
	// 	include: { meals: true }
	// });
	// if (!org)
	// 	redirect(`/organizations/${orgId}`);

	try
	{
		// const now = new Date();
		// const currentMinutes = now.getHours() * 60 + now.getMinutes();
		// const activeMeal = org.meals.find(meal =>
		// {
		// 	const start = new Date(meal.startTime);
		// 	const end = new Date(meal.endTime);
		// 	const startMinutes = start.getHours() * 60 + start.getMinutes();
		// 	const endMinutes = end.getHours() * 60 + end.getMinutes();
		// 	return (currentMinutes >= startMinutes && currentMinutes <= endMinutes);
		// });

		// const startOfDay = new Date();
		// startOfDay.setHours(0, 0, 0, 0);

		// const endOfDay = new Date();
		// endOfDay.setHours(23, 59, 59, 999);

		// const recentScans = await prisma.badgeScan.findMany
		// ({
		// 	where:
		// 	{
		// 		rfidReader: { organizationId: orgId },
		// 		mealId: activeMeal?.id,
		// 		createdAt: { gte: startOfDay, lte: endOfDay }
		// 	},
		// 	orderBy: { createdAt: "desc" },
		// 	take: 5,
		// 	select:
		// 	{
		// 		id: true,
		// 		createdAt: true,
		// 		status: true,
		// 		badge: 
		// 		{
		// 			select: 
		// 			{
		// 				user:
		// 				{
		// 					select:
		// 					{
		// 						firstname: true,
		// 						lastname: true,
		// 						role: true,
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}
		// });

		// const acceptedScansCount = await prisma.badgeScan.count
		// ({
		// 	where:
		// 	{
		// 		status: RequestStatus.ACCEPTED,
		// 		rfidReader: { organizationId: orgId },
		// 		mealId: activeMeal?.id,
		// 		createdAt: { gte: startOfDay, lte: endOfDay }
		// 	},
		// });

		// const pendingScan = await prisma.badgeScan.findFirst
		// ({
		// 	where:
		// 	{
		// 		status: RequestStatus.PENDING,
		// 		rfidReader: { organizationId: orgId },
		// 	},
		// 	select:
		// 	{
		// 		id: true,
		// 		createdAt: true,
		// 		status: true,
		// 		badge:
		// 		{
		// 			select:
		// 			{
		// 				user:
		// 				{
		// 					select:
		// 					{
		// 						firstname: true,
		// 						lastname: true,
		// 						role: true,
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}
		// });

		const demo_recentScans =
		[
			{
				id: 1,
				createdAt: new Date(),
				status: "ACCEPTED",
				badge:
				{
					user:
					{
						firstname: "Ahmed",
						lastname: "Benali",
						role: "Student",
					},
				},
			},
			{
				id: 2,
				createdAt: new Date(Date.now() - 1000 * 60 * 5),
				status: "ACCEPTED",
				badge:
				{
					user:
					{
						firstname: "Sara",
						lastname: "El Idrissi",
						role: "Teacher",
					},
				},
			},
			{
				id: 3,
				createdAt: new Date(Date.now() - 1000 * 60 * 15),
				status: "REJECTED",
				badge:
				{
					user:
					{
						firstname: "Youssef",
						lastname: "Alaoui",
						role: "Staff",
					},
				},
			},
		];
	
		const demo_pending_scan =
		{
			id: 99,
			createdAt: new Date(),
			status: "PENDING",
			badge:
			{
				user:
				{
					firstname: "Fatima",
					lastname: "Zahra",
					role: "Student",
				},
			},
		};

		const demo_active_meal =
		{
			name: "Lunch",
			startTime: new Date("2026-06-24T12:00:00"),
			endTime: new Date("2026-06-24T14:00:00"),
		};

		return (
  			<ScansClient recent_scans={demo_recentScans} accepted_scan_count={2} org_name="Tech Corp" org_dd={1} pending_scan={null} active_meal={demo_active_meal}/>
		);
	}
	catch (error)
	{
		// redirect(`/organizations/${orgId}`);
	}
}
