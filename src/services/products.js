import { collection, getDocs, doc, getDoc, query, where, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

const productsCol = collection(db, "products");

export async function fetchProducts() {
  const snap = await getDocs(productsCol);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function fetchProductById(id) {
  const d = await getDoc(doc(db, "products", id));
  if (!d.exists()) return null;
  return { id: d.id, ...d.data() };
}