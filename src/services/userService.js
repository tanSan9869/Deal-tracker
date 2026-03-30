import { db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Save the avatar as a Base64 string in Firestore
export const updateUserAvatar = async (userId, base64Image) => {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, { avatar: base64Image }, { merge: true });
};

// Retrieve the base64 avatar from Firestore
export const getUserAvatar = async (userId) => {
  const userRef = doc(db, "users", userId);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return docSnap.data().avatar;
  }
  return null;
};