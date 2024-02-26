import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { isEqual, startOfDay } from "date-fns";

const salesCollection = collection(db, 'sales')
const monthsCollection = collection(db, 'salesFromPreviousMonth')

const getDashboardOfTheDay = async () => {
  const today = startOfDay(new Date())

  const collection = await getDocs(salesCollection)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const salesList : any[] = collection.docs.map((doc) => {
    const data = doc.data()
    const date = data.timestamp.toDate()
    const day = startOfDay(date)
    return {...data, day}
  }).filter(sale => isEqual(sale.day, today))

  const valueArray: number[] = []

  salesList.forEach((unused, index) => {
    valueArray.push(salesList[index].charge)
  } )

  const totalValue = valueArray.reduce((accumulator, current) => accumulator + current, 0)
  const sales = salesList.length

  return {sales, totalValue}
}

const getDashboardOfTheMonth = async () => {
  const data = await getDocs(salesCollection)
  const list = data.docs.map((doc) => ({...doc.data()}))

  const valueArray: number[] = []

  list.forEach((unused, index) => {
    valueArray.push(list[index].charge)
  })

  const totalValue = valueArray.reduce((accumulator, current) => accumulator + current, 0)
  const sales = list.length

  return {sales, totalValue}
}

const getDashboardOfTheMonthNumber = async (monthNumber: number) => {
  const q = query(monthsCollection, where('month', '==', monthNumber))
  const querySnapshot = await getDocs(q)

  console.log(querySnapshot.size)

  if (querySnapshot.size > 0) {
    return querySnapshot.docs[0].data()
  }

  return false
} 

export {getDashboardOfTheDay, getDashboardOfTheMonth, getDashboardOfTheMonthNumber}