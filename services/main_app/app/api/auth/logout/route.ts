import { NextResponse } from "next/server";
import { removeSession } from "@/lib/sessionManage";

export async function POST()
{
	await removeSession();
	return NextResponse.json({ success: true }, { status: 200 });
}
