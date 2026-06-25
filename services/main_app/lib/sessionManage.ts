"use server"

import { cookies } from "next/headers";
import { ft_verify } from "./jwtHelper";

type PendingTwoFactorPayload = {
    id: number;
    role: string;
    flow: "login";
};

export async function getSession() {
    const cookieStorage = await cookies();
    const token: string | undefined = cookieStorage.get("session")?.value;

    if (!token)
        return null;

    const payload = ft_verify(token);
    if (!payload || typeof payload !== "object")
        return null;

    const parsed = payload as { id?: number; role?: string };
    if (typeof parsed.id !== "number" || typeof parsed.role !== "string")
        return null;

    return { id: parsed.id, role: parsed.role };
}

export async function removeSession() {
    const cookieStorage = await cookies();
    cookieStorage.delete("session");
}

export async function getPendingTwoFactorSession(): Promise<PendingTwoFactorPayload | null> {
    const cookieStorage = await cookies();
    const token: string | undefined = cookieStorage.get("pending_2fa")?.value;

    if (!token)
        return null;

    const payload = ft_verify(token);
    if (!payload || typeof payload !== "object")
        return null;

    const parsed = payload as { id?: number; role?: string; flow?: string };
    if (parsed.flow !== "login" || typeof parsed.id !== "number" || typeof parsed.role !== "string")
        return null;

    return { id: parsed.id, role: parsed.role, flow: "login" };
}

export async function removePendingTwoFactorSession() {
    const cookieStorage = await cookies();
    cookieStorage.delete("pending_2fa");
}

