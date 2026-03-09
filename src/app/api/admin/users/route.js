import admin from "@/app/lib/firebaseAdmin";

const SUPER_ADMIN = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;

// GET — list all users
export async function GET() {
  try {
    const list = await admin.auth().listUsers();
    const users = list.users.map((u) => ({
      uid: u.uid,
      email: u.email,
      createdAt: u.metadata.creationTime,
      lastLogin: u.metadata.lastSignInTime,
      disabled: u.disabled,
    }));
    return Response.json({ users });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// POST — create new user
export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const user = await admin.auth().createUser({ email, password });
    return Response.json({ uid: user.uid, email: user.email });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
