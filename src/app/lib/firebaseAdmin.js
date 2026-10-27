import admin from "firebase-admin";

function getPrivateKey() {
  if (process.env.FIREBASE_PRIVATE_KEY_B64) {
    return Buffer.from(process.env.FIREBASE_PRIVATE_KEY_B64, "base64").toString("utf8");
  }
  return process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
}

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: getPrivateKey(),
      }),
    });
  } catch (err) {
    console.error("Firebase Admin init failed:", err.message);
    throw err;
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export default admin;