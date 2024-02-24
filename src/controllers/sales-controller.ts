import { z } from "zod"
import { db } from "../config/firebase-config"
import { SalesSchema } from "../models/models"
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, where} from "firebase/firestore"
import { isEqual, startOfDay } from "date-fns"

type SalesParams = z.infer<typeof SalesSchema>
const salesCollection = collection(db, 'sales')

const getAllSales = async () => {
  const q = query(salesCollection, orderBy('timestamp', 'desc'))
  const querySnapshot = await getDocs(q)
  const salesList = querySnapshot.docs.map(doc => doc.data())
  return salesList
}

const getAllSalesDay = async () => {
  const today = startOfDay(new Date());

  const q = query(salesCollection, orderBy('timestamp', 'desc'))
  const querySnapshot = await getDocs(q)

  const salesList = querySnapshot.docs.map(doc => {
    const data = doc.data()
    const date = data.timestamp.toDate()
    const day = startOfDay(date)
    return { ...data, day }
  }).filter(sale => isEqual(sale.day, today))

  salesList.sort((a, b) => b.day.getTime() - a.day.getTime())
  return salesList
}

const createSale = async (sales: SalesParams) => {
  await addDoc(salesCollection, sales)
}

const deleteSale = async (id: number) => {
  const q = query(salesCollection, where('id', '==', id))
  const querySnapshot = await getDocs(q)
 

  if (querySnapshot.size > 0 ) {
    const docId = querySnapshot.docs[0].id
    const docRef = doc(salesCollection, docId)
    await deleteDoc(docRef)
    return true
  } 
  return false
}

export {getAllSales, getAllSalesDay , createSale, deleteSale}
