import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionManage";
import { prisma } from "@/lib/prisma";
import Settings from "./client";

export default async function SettingsPage() {
    const session = await getSession();

    if (!session) {
        redirect('/auth/login');
    }

    const user = await prisma.user.findUnique({
        where: { id: session.id },
        select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            phoneNumber: true,
            role: true,
            avatar: true,
            twoFactorEnabled: true,
            twoFactorEmail: true,
        }
    });

    if (!user) {
        redirect('/auth/login');
    }

    return <Settings user={user} />;
}