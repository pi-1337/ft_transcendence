'use server'

import { NextRequest, NextResponse } from "next/server";
import { ft_verify } from "@/lib/jwtHelper";

/*
 * TXData is given to us from the nodejs server
 * the data needs to be secured by TLS/SSL
 * and the authentisity is provided by the JWT
 * 
 * | frontend |  ----> sends the nodejs server
 * | nodejs-server | ---->  sends us the data after verifiying it
 *
 */

type TXData = {
    badgeNumber: string,
    orgId: number,
}

export async function POST(req: NextRequest) {
    try {
        const { transaction } = await req.json();

        const txData = ft_verify(transaction) as TXData | null;

        if (txData === null) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Unvalid JWT !!"
                },
                { status: 401 }
            );
        }

        const {} = txData;


        return NextResponse.json(
            {
                success: true,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                error: "Something went wrong, try again !!"
            },
            { status: 500 }
        );
    }

}
