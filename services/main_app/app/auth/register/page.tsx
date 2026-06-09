import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import RegisterForm from "./RegisterForm";
import { get42OAuthURL } from "@/lib/42school_Oauth";

export default async function RegisterPage() {
    const ft_auth_url = get42OAuthURL();

    return (
        <>
            <RegisterForm ft_auth_url={ft_auth_url} />
        </>
    );
}
