import { NextResponse } from "next/server";
import { adminDb } from "../../lib/firebaseAdmin";

export async function POST(req) {
  try {
    const body = await req.json();
    const { visitId, duration } = body;
    if (!visitId) {
      return NextResponse.json({ error: "missing visitId" }, { status: 400 });
    }

    await adminDb
      .collection("landing_visits")
      .doc(visitId)
      .update({ duration });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Duration tracking error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
