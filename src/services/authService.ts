import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword,
  User,
  UserProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import api from "./api";

import { registerForPushNotificationsAsync } from "./notificationService";

export const exchangeFirebaseToken = async (
  firebaseToken: string
): Promise<boolean> => {
  try {
    const response = await api.post("/firebase-login", {
      firebaseToken: firebaseToken,
    });

    const backendToken = response.data.token;

    if (backendToken) {
      await SecureStore.setItemAsync("backend_token", backendToken);
      console.log("[authService] Token do backend salvo com sucesso!");
      return true; // Sucesso!
    }

    console.error("[authService] O backend não retornou um token.");
    return false;
  } catch (error) {
    console.error("[authService] Erro ao trocar o token do Firebase:", error);
    await SecureStore.deleteItemAsync("backend_token");
    return false;
  }
};

export async function registerUser(
  email: string,
  password: string,
  displayName: string
) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    if (user) {
      await updateProfile(user, { displayName });

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        nomeSocial: displayName,
        email: email,
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
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // PEGA O TOKEN DO FIREBASE DO USUÁRIO LOGADO
    const firebaseIdToken = await user.getIdToken();

    const backendAuthSuccess = await exchangeFirebaseToken(firebaseIdToken);

    if (!backendAuthSuccess) {
      await signOut(auth);
      throw new Error("Falha na autenticação com o servidor.");
    }

    console.log("[authService] Registrando token push após login...");
    try {
      const pushToken = await registerForPushNotificationsAsync();
      if (pushToken) {
        await registerPushToken(pushToken);
      }
    } catch (pushError) {
      console.error("[authService] Erro ao registrar push token:", pushError);
    }
    
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const nomeSocial = userData.nomeSocial;

      await AsyncStorage.setItem("userNomeSocial", nomeSocial);

      return { ...user, nomeSocial: nomeSocial };
    } else {
      await signOut(auth);
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
  await signOut(auth);
  await SecureStore.deleteItemAsync("backend_token");
  console.log("[authService] Token do backend removido durante o logout.");
}

export async function registerPushToken(token: string) {
  try {
    const response = await api.post("/api/push/register", { token: token });
    console.log(
      "[authService] Token Push salvo no backend com sucesso!",
      response.data
    );
  } catch (error) {
    console.error(
      "[authService] Erro ao salvar o token push no backend:",
      error
    );
  }
}

// Atualizar senha
export async function changeUserPassword(user: User, newPassword: string) {
  if (!newPassword.trim()) throw new Error("Senha não pode estar vazia");
  await updatePassword(user, newPassword);
}

export async function updateUserProfile(
  user: User,
  updates: { displayName?: string; photoURL?: string }
) {
  if (!user) throw new Error("Usuário não autenticado.");

  const { displayName, photoURL } = updates;

  try {
    await updateProfile(user, { displayName, photoURL });

    const userDocRef = doc(db, "users", user.uid);
    const firestoreUpdates: { nomeSocial?: string } = {};

    if (displayName) {
      firestoreUpdates.nomeSocial = displayName;
      await AsyncStorage.setItem("userNomeSocial", displayName);
    }

    if (Object.keys(firestoreUpdates).length > 0) {
      await updateDoc(userDocRef, firestoreUpdates);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}