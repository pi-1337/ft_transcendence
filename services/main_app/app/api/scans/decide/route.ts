import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/sessionManage";
import { RequestStatus } from "@prisma/client";

export async function POST(req: NextRequest)
{
    try {
        const session = await getSession();
        if (!session)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { requestId, decision } = await req.json();
        if (!requestId || ![RequestStatus.ACCEPTED, RequestStatus.REJECTED].includes(decision))
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

        const currentState = await prisma.badgeScan.findFirst({
            where: {id: requestId },
            include: {
                rfidReader: {
                    include: {
                        organization: {
                            include: { meals: true }
                        }
                    }
                }
            }
        });
        if (!currentState)
            return NextResponse.json({ error: "Scan not found" }, { status: 404 });

        if (currentState.status !== RequestStatus.PENDING)
            return NextResponse.json({ error: "Request is no longer pending" }, { status: 409 });

        if (session.role !== "ADMIN") {
        
            const isOrgAdmin = await prisma.organization.findFirst({
                where: {
                    id: currentState.rfidReader.organizationId,
                    admins: { some: { id: session.id } },
                }
            });
            if (!isOrgAdmin)
                return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
        if (decision === RequestStatus.ACCEPTED) {
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            const meals = currentState.rfidReader.organization.meals;

            const inMealWindow = meals.some(meal => {
                const start = new Date(meal.startTime);
                const end = new Date(meal.endTime);
                const startMinutes = start.getHours() * 60 + start.getMinutes();
                const endMinutes = end.getHours() * 60 + end.getMinutes();
                return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
            });

            if (!inMealWindow)
            {
                await prisma.badgeScan.update({
                    where: { 
                        id: requestId 
                    },
                    data: { 
                        status: RequestStatus.REJECTED
                    }
                });
                return NextResponse.json({ success: true, decision: RequestStatus.REJECTED, reason: "Meal window closed" });
            }
        }

        await prisma.badgeScan.update({
            where: { 
                id: requestId 
            },
            data: { 
                status: decision 
            }
        });


        return NextResponse.json({ success: true, decision });

    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
