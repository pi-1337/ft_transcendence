'use server'

import { getSession } from "@/lib/sessionManage";
import Client from "./client";
import { prisma } from "@/lib/prisma";

export default async function Home() {
    const id = await getSession();

    if (!id)
        return "not logged in";

    const organizations = await prisma.organization.findMany();

    return <Client organizations={organizations} />;
}
