import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { get42OAuthURL } from "@/lib/42school_Oauth";
import LoginForm from "./RegisterForm";
import RegisterForm from "./RegisterForm";

export default async function RegisterPage() {
 return <RegisterForm ftAuthUrl={get42OAuthURL()}/>
}
