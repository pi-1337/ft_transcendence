'use server'

import { getSession } from "./sessionManage";
import path from 'path';
import fs from 'fs';
import { randomUUID } from "crypto";
import { prisma } from "./prisma";

export const changeAvatar = async (formData: FormData) => {
    const session = await getSession();

    if (!session?.id) {
        return {success: false, error: "Not Authorized !!", avatarLink: null};
    }
    const file = (formData.get('file') || null) as (File | null);

    if (!file || file?.size === 0) {
        return {success: false, error: "No file Provided !", avatarLink: null};
    }

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif"
    ];

    if (allowedTypes.includes(file.type) === false) {
        return {success: false, error: "Only images are allowed !!!", avatarLink: null};
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extension = file.name.split(".").pop();
    
    const filename = session.id.toString()
                    + '-'
                    + randomUUID()
                    + '.'
                    + extension;
    const uploadPath = path.join(process.cwd(), "public/avatars", filename);

    try {
        fs.writeFileSync(uploadPath, buffer);
        const avatarLink = "/avatars/" + filename;

        await prisma.user.update({
            where: { id: session.id },
            data: { avatar: avatarLink }
        });

        return {success: true, error: "", avatarLink};
    } catch (error) {
        return {success: false, error: "Something went wrong !!", avatarLink: null};
    }
}
