import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { get42OAuthURL } from "@/lib/42school_Oauth";
import Register from "./register";

export default async function RegisterPage()
{
	const session = await getSession();
	if (session)
		redirect("/dashboard");
	const ft_auth_url = get42OAuthURL();

	return (
		<Register ft_auth_url={ft_auth_url} />
	);
}
