import { redirect } from "next/navigation";
import { getPendingTwoFactorSession, getSession } from "@/lib/sessionManage";
import TwoFactor from "./two_factor";

export default async function TwoFactorPage()
{
	// const session = await getSession();
	// if (session)
	// {
	// 	if (session.role === "ADMIN")
	// 		redirect("/admin/dashboard");
	// 	redirect("/dashboard");
	// }
	// const pending = await getPendingTwoFactorSession();
	// if (!pending)
	// 	redirect("/auth/login");

	return (
		<TwoFactor />
	);
}
