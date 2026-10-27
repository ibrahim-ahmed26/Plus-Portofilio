import { NextResponse } from "next/server";
import crypto from "crypto";
import { notifyAdmins } from "../../lib/notifyAdmins";

function sha256(value) {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export async function POST(req) {
  const body = await req.json();
  const { name, email, phone, message } = body;

  try {
    const payload = {
      data: [
        {
          event_name: "Lead",
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          user_data: {
            em: [sha256(email)],
            ph: phone ? [sha256(phone.replace(/\D/g, ""))] : undefined,
          },
        },
      ],
    };

    if (process.env.META_TEST_EVENT_CODE) {
      payload.test_event_code = process.env.META_TEST_EVENT_CODE;
    }

    const metaRes = await fetch(
      `https://graph.facebook.com/v19.0/${process.env.NEXT_PUBLIC_FB_PIXEL_ID}/events?access_token=${process.env.FB_CONVERSIONS_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    const metaJson = await metaRes.json();
    console.log("Meta Conversions API response:", metaJson);
  } catch (err) {
    console.error("Meta Conversions API error:", err);
  }

  // 2. Notify all dashboard users
  await notifyAdmins({
    subject: `New Landing Page Lead: ${name}`,
    text: `New submission from the landing page:\n\nName: ${name}\nCompany: ${body.company || "—"}\nEmail: ${email}\nPhone: ${phone || "—"}\nService: ${body.service || "—"}\nBudget: ${body.budget || "—"}`,
  });

  return NextResponse.json({ success: true });
}