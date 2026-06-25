import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import CreateOrgForm from "./CreateOrgForm";

export default async function CreateOrgPage()
{
	// const session = await getSession();
	// if (!session)
	// 	redirect("/auth/login");
	// if (session.role !== "ADMIN")
	// 	redirect("/dashboard");

	return (
		<CreateOrgForm />
	);
}
