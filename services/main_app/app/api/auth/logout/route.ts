import { NextResponse } from "next/server";
import { removeSession } from "@/lib/sessionManage";

export async function POST() {
    await removeSession();
    return NextResponse.json({ success: true }/* IN_CASE_OF_BAD_IDEA , { status: 200 } IN_CASE_OF_BAD_IDEA */);
}
