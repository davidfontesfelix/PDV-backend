import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase-config";

async function collectionSize(collectionName: string) {
  const collectionRef = collection(db, collectionName)
  const snapshot = await getDocs(collectionRef)
  const size = snapshot.size
  return size
}

export {collectionSize}