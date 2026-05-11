'use server'

import { getSession } from "@/lib/sessionManage";
import OrganizationDetail from "./client";

export default async function Page({ params }: { params: { id: string } }) {
    const id = await getSession();

    if (!id)
        return "not logged in";

    return <OrganizationDetail orgId={params.id} />;
}
