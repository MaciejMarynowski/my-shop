import admin from "firebase-admin";
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });
}
const db = admin.firestore();

export default async function handler(req, res) {

  if (req.method === "POST") {
    const { name, description, price, stock, imageURL, category } = req.body;
    const docRef = await db.collection("products").add({ name, description, price, stock, imageURL, category, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    return res.status(200).json({ id: docRef.id });
  }
  res.status(405).end();
}