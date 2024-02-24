import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { ProductSchema } from "../models/models";
import { z } from "zod";

const productsCollection = collection(db, 'products')
type productParams = z.infer<typeof ProductSchema>

const getAllProducts = async () => {
  const data = await getDocs(productsCollection)
  const productsList = data.docs.map((doc) => ({...doc.data()}))
  return productsList
}

const getProductByCode = async (code: number) => {
  const q = query(productsCollection, where('code', '==', code))
  const querySnapshot = await getDocs(q)

  if (querySnapshot.size > 0 ) {
    const data = querySnapshot.docs[0].data()
    return data
  }
  return false
}

const createProduct = async (product: productParams) => {
  await addDoc(productsCollection, product)
}

const checkCode = async (code: number) => {
  const q = query(productsCollection, where('code', '==', code))
  const querySnapshot = await getDocs(q)
  return querySnapshot.size > 0
} 

const updateAmount = async (code: number , amount: number) => {
  const q = query(productsCollection, where('code', '==', code))
  const querySnapshot = await getDocs(q)
 
  
  if (querySnapshot.size > 0) {
    const docId = querySnapshot.docs[0].id
    const currentAmount = querySnapshot.docs[0].data().amount;
    const updatedAmount = currentAmount + amount
    const productRef = doc(productsCollection, docId)

    await updateDoc(productRef, { amount: updatedAmount });
    return true
  }
  return false
}

const updateProduct = async (product: productParams, code: number) => {
  const q = query(productsCollection, where('code', '==', code))
  const querySnapshot = await getDocs(q)

  if (querySnapshot.size > 0) {
    const docId = querySnapshot.docs[0].id
    const productRef = doc(productsCollection, docId)
    await updateDoc(productRef, product);
  }
}

const deleteProduct = async (code: number) => {
  const q = query(productsCollection, where('code', '==', code))
  const querySnapshot = await getDocs(q)

  if (querySnapshot.size > 0) {
    const docId = querySnapshot.docs[0].id;
    const docRef = doc(db, 'products', docId)
    await deleteDoc(docRef)
    return true
  } 
  return false 
}

const getProduct = async (code: number) => {
  const q = query(collection(db, 'products'), where('code', '==', code))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs[0].data()
}

export {getAllProducts, getProductByCode, createProduct, checkCode, updateAmount, updateProduct, deleteProduct, getProduct}