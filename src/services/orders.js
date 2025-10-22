import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function createOrder(orderData) {
  const col = collection(db, "orders");
  const docRef = await addDoc(col, orderData);
  return docRef.id;
}