import { redirect } from "next/navigation";
import { getPendingTwoFactorSession, getSession } from "@/lib/sessionManage";
import TwoFactorClient from "./client";

export default async function TwoFactorPage() {
    const session = await getSession();
    if (session) {
        if (session.role === 'ADMIN')
            redirect('/admin/dashboard');
        redirect('/dashboard');
    }

    const pending = await getPendingTwoFactorSession();
    if (!pending)
        redirect('/auth/login');

    return <TwoFactorClient />;
}
