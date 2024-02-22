import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { z } from "zod";
import { CategoryParamsSchema } from "../models/models";

const categoriesCollection = collection(db, 'categories')
type categoryParams = z.infer<typeof CategoryParamsSchema>

const getALlCategories = async () => {
  const data = await getDocs(categoriesCollection)
  const categoriesList = data.docs.map((doc) => ({...doc.data()}))
  return categoriesList
}

const checkNameExists = async (name: string) => {
  const q = query(categoriesCollection, where('name', '==', name))
  const querySnapshot = await getDocs(q)
  return querySnapshot.size > 0
}

const checkIdCategory = async (id: string) => {
  const q = query(categoriesCollection, where('id', '==', id))
  const querySnapshot = await getDocs(q)
  return querySnapshot.size > 0
}

const createCategory = async (category: categoryParams) => {
  await addDoc(categoriesCollection, category)
}

const updateCategory = async (category: categoryParams, id: string) => {
  const q = query(categoriesCollection, where('id', '==', id))
  const querySnapshot = await getDocs(q)

  if(querySnapshot.size > 0) {
    const docId = querySnapshot.docs[0].id
    const categoryRef = doc(categoriesCollection, docId)
    await updateDoc(categoryRef, category)
    return true
  }
  return false
}

const deleteCategory = async (id: string) => {
  const q = query(categoriesCollection, where('id', '==', id))
  const querySnapshot = await getDocs(q)

  if(querySnapshot.size > 0) {
    const docId = querySnapshot.docs[0].id;
    const docRef = doc(categoriesCollection, docId)
    await deleteDoc(docRef)
    return true
  }
  return false
}

export {getALlCategories, checkNameExists, createCategory, checkIdCategory, updateCategory, deleteCategory}