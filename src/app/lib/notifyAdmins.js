import { Resend } from "resend";
import { getAuth } from "firebase-admin/auth";
import "./firebaseAdmin"; // makes sure the Admin app is initialized

const resend = new Resend(process.env.RESEND_API_KEY);

export async function notifyAdmins({ subject, text }) {
    if (!process.env.RESEND_API_KEY) {
        console.log("Resend not configured yet — skipping admin notifications.");
        return;
    }

    try {
        const { users } = await getAuth().listUsers(1000);
        const emails = users
            .map((user) => user.email)
            .filter(Boolean);

        if (emails.length === 0) {
            console.log("No dashboard user emails found — skipping notification.");
            return;
        }

        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM || "onboarding@resend.dev",
            to: emails,
            subject,
            text,
        });

        if (error) {
            console.error("Resend rejected the email:", error);
            return;
        }

        console.log(`Notified ${emails.length} dashboard user(s):`, emails, data);
    } catch (err) {
        console.error("notifyAdmins error:", err);
    }
}