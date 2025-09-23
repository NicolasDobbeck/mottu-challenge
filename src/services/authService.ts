import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Criar usuário (registro)
export async function registerUser(email: string, password: string, displayName: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user) {
      await updateProfile(user, { displayName });
      
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        nomeSocial: displayName,
        email: email
      });
      await signOut(auth);
      
      return user;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

// Login
export async function loginUser(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const nomeSocial = userData.nomeSocial;

      // Salva o nome social no AsyncStorage somente após o login
      await AsyncStorage.setItem('userNomeSocial', nomeSocial);

      return { ...user, nomeSocial: nomeSocial };
    } else {
      throw new Error("Dados do usuário não encontrados.");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

// Logout
export async function logoutUser() {
  await AsyncStorage.clear();
  await signOut(auth);
}

// Atualizar senha
export async function changeUserPassword(user: User, newPassword: string) {
  if (!newPassword.trim()) throw new Error("Senha não pode estar vazia");
  await updatePassword(user, newPassword);
}