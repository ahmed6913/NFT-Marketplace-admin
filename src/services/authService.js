// src/services/authService.js
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};
