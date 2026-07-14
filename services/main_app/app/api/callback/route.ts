// https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-376bba863ec2842955144b8069d4382379fbbf08879692c9edcf5205efc61405&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fcallback&response_type=code

import { authorizeUserByCode, User_42 } from "@/lib/42school_Oauth";
import { ft_sign } from "@/lib/jwtHelper";
import { prisma } from "@/lib/prisma";
import { startTwoFactorChallenge } from "@/lib/twoFactor";
import { User } from "@prisma/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get("code");

    if (!code) {
        return NextResponse.json({
            status: 400,
            error: "No code provided !"
        });
    }

    try {

        const user: User_42 | null = await authorizeUserByCode(code);

        if (!user) {
            return NextResponse.json({
                status: 500,
                error: "Invalid code !"
            });
        }

        const { email, first_name, last_name, login } = user;


        // email && login       ---> login
        // !email && !login     ---> create
        // email && !login      ---> link
        // !email && login      ---> impossible

        let authenticatedUser: User | null = null;

        const existingUserWithSameEmail: User | null = await prisma.user.findUnique({
            where: { email }
        });
        const existingUserWithSameLogin: User | null = await prisma.user.findUnique({
            where: { login }
        });

        if (existingUserWithSameEmail && existingUserWithSameLogin) {
            // login
            // existingUserWithSameEmail == existingUserWithSameLogin
            authenticatedUser = existingUserWithSameLogin;
        } else if (!existingUserWithSameEmail && !existingUserWithSameLogin) {
            // create user with this email and login
            authenticatedUser = await prisma.user.create({
                data: {
                    firstname: first_name,
                    lastname: last_name,
                    email,
                    login
                }
            });
        } else if (existingUserWithSameEmail && !existingUserWithSameLogin) {
            // link existing user with current login
            authenticatedUser = existingUserWithSameEmail;
            await prisma.user.update({
                where: {
                    email,
                },
                data: {
                    login
                }
            });
        } else {
            // impossible
        }

        if (!authenticatedUser) {
            // impossible
            return NextResponse.json({
                status: 404,
                error: "No such User !"
            });
        }

        if (authenticatedUser.twoFactorEnabled) {
            const pendingToken = ft_sign({ id: authenticatedUser.id, role: authenticatedUser.role, flow: 'login' }, '10m');
            const destinationEmail = authenticatedUser.twoFactorEmail || authenticatedUser.email;
            await startTwoFactorChallenge(authenticatedUser.id, destinationEmail, 'LOGIN');

            const cookieStorage = await cookies();
            cookieStorage.set('pending_2fa', pendingToken, {
                httpOnly: true,
            });

            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL as string}/auth/2fa`);
        }

        const token = ft_sign({ id: authenticatedUser.id, role: authenticatedUser.role });

        const cookieStorage = await cookies();
        cookieStorage.set('session', token, {
            httpOnly: true,
        });

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL as string}/dashboard`);

<<<<<<< HEAD
    } catch {
=======
    } catch (error) {
>>>>>>> 000abc7 (removed all console.error()s and added redirect to the login and register pages)
        return NextResponse.json({
            status: 500,
            error: "Something went wrong !"
        });
    }
}
