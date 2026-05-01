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

    return payload.id as number;
}

export async function removeSession() {
    const cookieStorage = await cookies();
    cookieStorage.delete('token');
}

