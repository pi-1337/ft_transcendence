import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";
import AdminDashboard from "./client";

export default async function AdminDashboardPage()
{
	// const session = await getSession();
	// if (!session)
	// 	redirect("/auth/login");
	// if (session.role !== "ADMIN")
	// 	redirect("/dashboard");

	// const { id } = session;
	// const [admin, totalUsers, totalOrgs, totalReaders] = await Promise.all
	// ([
	// 	prisma.user.findUnique({ where: { id }, select: { firstname: true, lastname: true, email: true } }),
	// 	prisma.user.count(),
	// 	prisma.organization.count(),
	// 	prisma.rfidReaders.count(),
	// ]);
	// if (!admin)
	// 	redirect("/auth/login");

	const demo_admin = { firstname: "Asmae", lastname: "Mandour", email: "admin@ft-transcendence.com" };
	const total_users = 248;
	const total_orgs = 37;
	const total_readers = 89;

	return (
		<AdminDashboard firstname={demo_admin.firstname} lastname={demo_admin.lastname} email={demo_admin.email} totalUsers={total_users} totalOrgs={total_orgs} totalReaders={total_readers}/>
	);
}
