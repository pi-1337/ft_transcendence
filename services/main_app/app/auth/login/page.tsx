import { redirect } from "next/navigation";
import { getPendingTwoFactorSession, getSession } from "@/lib/sessionManage";
import { get42OAuthURL } from "@/lib/42school_Oauth";
import Login from "./Login";

export default async function LoginPage()
{
	const session = await getSession();
	const pending = await getPendingTwoFactorSession();
	if (session)
		redirect("/dashboard");
	if (pending)
		redirect("/auth/2fa");
	const ft_auth_url = get42OAuthURL();

	return (
		<Login ft_auth_url={ft_auth_url} />
	);
}
