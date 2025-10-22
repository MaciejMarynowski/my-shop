import admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { action, uid } = req.body;
      if (!action || !uid) return res.status(400).json({ error: "Missing params" });

      if (action === "promote") {
        await admin.auth().setCustomUserClaims(uid, { admin: true });
        return res.status(200).json({ message: "User promoted" });
      }
      if (action === "demote") {
        await admin.auth().setCustomUserClaims(uid, { admin: false });
        return res.status(200).json({ message: "User demoted" });
      }
      return res.status(400).json({ error: "Unknown action" });
    }
    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
}