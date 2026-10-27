import { NextResponse } from "next/server";
import { notifyAdmins } from "../../lib/notifyAdmins";

export async function POST(req) {
  const body = await req.json();
  const { name, company, email, phone, service, message } = body;

  await notifyAdmins({
    subject: `New Contact Form Submission: ${name}`,
    text: `New submission from the Contact page:\n\nName: ${name}\nCompany: ${company || "—"}\nEmail: ${email}\nPhone: ${phone || "—"}\nService: ${service || "—"}\nMessage: ${message || "—"}`,
  });

  return NextResponse.json({ success: true });
}