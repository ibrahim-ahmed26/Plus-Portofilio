import admin from "@/app/lib/firebaseAdmin";

const SUPER_ADMIN = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;

export async function DELETE(req, { params }) {
  try {
    const { uid } = await params; // 👈 await params
    const user = await admin.auth().getUser(uid);

    if (user.email === SUPER_ADMIN) {
      return Response.json(
        { error: "Super admin cannot be deleted." },
        { status: 403 },
      );
    }

    await admin.auth().deleteUser(uid);
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { uid } = await params;
    const user = await admin.auth().getUser(uid);

    if (user.email === SUPER_ADMIN) {
      return Response.json(
        { error: "Super admin cannot be disabled." },
        { status: 403 },
      );
    }

    const { disabled } = await req.json();
    await admin.auth().updateUser(uid, { disabled });
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
