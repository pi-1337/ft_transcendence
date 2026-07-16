import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { get42OAuthURL } from "@/lib/42school_Oauth";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
 

  return <LoginForm ftAuthUrl={get42OAuthURL()} />;
}
