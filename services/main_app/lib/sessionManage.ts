'use server'

import { cookies } from "next/headers";
import { ft_verify } from "./jwtHelper";

export async function getSession() {
    const cookieStorage = await cookies();
    const token: string | undefined = cookieStorage.get('session')?.value;

    if (!token)
        return null;

    const payload: any = ft_verify(token);
    if (!payload)
        return null;

    return { id: payload.id as number, role: payload.role as string };
}

export async function removeSession() {
    const cookieStorage = await cookies();
    cookieStorage.delete('session');
}

