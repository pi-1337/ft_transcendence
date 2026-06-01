import { Active } from "@prisma/client";

export type UserFrontend = {
    id: number,
    firstname: string,
    lastname: string,
    email: string,
    phoneNumber: string,
    role: string,
    avatar: string
};


export type OrgsFrontend = {
    id: number,
    name: string,
    type: string,
    service: string,
    badgeTimes: number,
    active: Active,
    createdAt: Date
};
