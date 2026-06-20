import { redirect } from "next/navigation";
import { getPendingTwoFactorSession, getSession } from "@/lib/sessionManage";
import LoginForm from "./LoginForm";
import { get42OAuthURL } from "@/lib/42school_Oauth";

export default async function LoginPage() {
    const session = await getSession();
    if (session) redirect('/dashboard');
    

    const pending = await getPendingTwoFactorSession();

    if (session)
        redirect('/dashboard');
    if (pending)
        redirect('/auth/2fa');

    const ft_auth_url = get42OAuthURL();

    return (
        <>
            <LoginForm ft_auth_url={ft_auth_url} />
        </>
    );
}
