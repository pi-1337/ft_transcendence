import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import LoginForm from "./LoginForm";
import { get42OAuthURL } from "@/lib/42school_Oauth";

export default async function LoginPage() {
    const ft_auth_url = get42OAuthURL();

    return (
        <>
            <LoginForm ft_auth_url={ft_auth_url} />
        </>
    );
}
