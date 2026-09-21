import { NextResponse } from "next/server";
import crypto from "crypto";

function sha256(value) {
  return crypto
    .createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

export async function POST(req) {
  const body = await req.json();
  const { name, email, phone, message } = body;

  // 1. Send server-side Lead event to Meta Conversions API
  try {
    await fetch(
      `https://graph.facebook.com/v19.0/${process.env.NEXT_PUBLIC_FB_PIXEL_ID}/events?access_token=${process.env.FB_CONVERSIONS_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
        }),
      },
    );
  } catch (err) {
    console.error("Meta Conversions API error:", err);
  }

  // 2. Email the owner — only if credentials are configured
  if (
    process.env.EMAIL_USER &&
    process.env.EMAIL_APP_PASSWORD &&
    process.env.EMAIL_TO
  ) {
    try {
      const nodemailer = (await import("nodemailer")).default;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: `"Landing Page" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: `New Lead: ${name}`,
        text: `New submission from the landing page:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "—"}\nMessage: ${message}`,
      });
    } catch (err) {
      console.error("Email send error:", err);
      // don't fail the whole request just because email didn't send
    }
  } else {
    console.log(
      "Email not configured yet — skipping notification email. Lead saved to Firestore.",
    );
  }

  return NextResponse.json({ success: true });
}
