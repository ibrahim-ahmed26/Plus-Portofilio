// scripts/seeds.cjs
require("dotenv").config({ path: ".env.local" });
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

const db = admin.firestore();

const defaultImages = {
  "01": "/services/branding.jpg",
  "02": "/services/marketing.jpg",
  "03": "/services/social.jpg",
  "04": "/services/events.jpg",
  "05": "/services/media.jpg",
  "06": "/services/uiux.jpg",
};

async function seedImages() {
  const snapshot = await db.collection("services").get();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const image = defaultImages[data.num];
    if (image) {
      await doc.ref.update({ image });
      console.log(`Updated ${doc.id} (${data.num}) with image: ${image}`);
    } else {
      console.log(`No default image mapped for ${doc.id} (${data.num})`);
    }
  }

  console.log("Done seeding images.");
  process.exit(0);
}

seedImages().catch((err) => {
  console.error(err);
  process.exit(1);
});
