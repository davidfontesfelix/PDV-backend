import { endOfMonth, startOfMonth, sub } from "date-fns"
import { addDoc, collection, deleteDoc, getDocs, query, where } from "firebase/firestore"
import { db } from "../config/firebase-config"

const deleteSalesPreviousMonth = async () => {
  const startOfPreviousMonth = startOfMonth(sub(new Date(), {months: 1}))
  const endOfPreviousMonth = endOfMonth(sub(new Date(), {months: 1}))

  const q = query(collection(db, "sales"), where('timestamp', '>=', startOfPreviousMonth), where('timestamp', '<=', endOfPreviousMonth))
  const querySnapshot = await getDocs(q)

  const getValue = querySnapshot.docs.map((doc) => doc.data().charge)
  const valueReducer = getValue.reduce((accumulator, current) => accumulator + current, 0)
  const monthNumber = new Date().getMonth() + 1

  const qMonth = query(collection(db, 'salesFromPreviousMonth'), where('month', '==', monthNumber))
  const querySnapshotMonth = await getDocs(qMonth)

  if(querySnapshotMonth.size === 0) {
    await addDoc(collection(db, 'salesFromPreviousMonth'), {month: monthNumber, totalProfit: valueReducer, salesAmount: querySnapshot.size})
  }

  const deletePromises = querySnapshot.docs.map(async (doc) => await deleteDoc(doc.ref))

  await Promise.all(deletePromises)
}

export {deleteSalesPreviousMonth}