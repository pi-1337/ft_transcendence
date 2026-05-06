import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import CreateUserForm from "./CreateUserForm";

export default async function CreateUserPage() {
    const session = await getSession();

    if (!session)
        redirect('/auth/login');
    if (session.role !== 'ADMIN')
        redirect('/dashboard');

    return <CreateUserForm />;
}
