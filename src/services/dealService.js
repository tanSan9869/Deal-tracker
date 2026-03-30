/* eslint-disable no-unused-vars */
import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc, serverTimestamp, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";


const getDealsCollection = (userId) => {
  return collection(db, "users", userId, "deals");
};


export const createDeal = async (userId, dealData) => {
  try {
    const dealsRef = getDealsCollection(userId);
    const newDeal = {
      ...dealData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(dealsRef, newDeal);
    return { id: docRef.id, ...newDeal };
  } catch (error) {
    console.error("Error creating deal:", error);
    throw error;
  }
};

export const subscribeToUserDeals = (userId, callback, onError) => {
  const dealsRef = getDealsCollection(userId);
  
  return onSnapshot(dealsRef, (snapshot) => {
    const deals = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : Date.now();
      return timeB - timeA;
    });
    
    callback(deals);
  }, (error) => {
    console.error("Error subscribing to deals:", error);
    if (onError) onError(error);
  });
};


export const getUserDeals = async (userId) => {
  try {
    const dealsRef = getDealsCollection(userId);
    const querySnapshot = await getDocs(dealsRef);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching deals:", error);
    throw error;
  }
};


export const updateDeal = async (userId, dealId, updatedData) => {
  try {
    const dealRef = doc(db, "users", userId, "deals", dealId);
    const dataToUpdate = {
      ...updatedData,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(dealRef, dataToUpdate);
    return true;
  } catch (error) {
    console.error("Error updating deal:", error);
    throw error;
  }
};


export const deleteDeal = async (userId, dealId) => {
  try {
    const dealRef = doc(db, "users", userId, "deals", dealId);
    await deleteDoc(dealRef);
    return true;
  } catch (error) {
    console.error("Error deleting deal:", error);
    throw error;
  }
};


export const saveUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, userData);
    return true;
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
};
