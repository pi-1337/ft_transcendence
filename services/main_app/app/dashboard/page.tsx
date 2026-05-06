'use server'

import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";
import Dashboard from "./client";

export default async function Home() {
    const session = await getSession();

    if (!session)
        redirect('/auth/login');

    const { id } = session;

    const user = await prisma.user.findUnique({
        where: { id },
        select: { firstname: true, lastname: true, email: true },
    });

    if (!user)
        redirect('/auth/login');

    return <Dashboard firstname={user.firstname} lastname={user.lastname} email={user.email} />;
}

