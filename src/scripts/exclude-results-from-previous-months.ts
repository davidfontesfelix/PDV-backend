import { collection, deleteDoc, getDocs} from "firebase/firestore"
import { db } from "../config/firebase-config"

const excludeResultsFromPreviousMonth = async () => {
  const salesFromPreviousMonthCollection = collection(db, 'salesFromPreviousMonth');
  const querySnapshot = await getDocs(salesFromPreviousMonthCollection)
  
  querySnapshot.forEach(async (doc) => {
    await deleteDoc(doc.ref)
  })
}

export {excludeResultsFromPreviousMonth}
