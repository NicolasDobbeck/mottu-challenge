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
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import api from './api';

export const exchangeFirebaseToken = async (firebaseToken: string): Promise<boolean> => {
  try {
    // 1. Faz a chamada para o endpoint que criamos no Spring Boot
    const response = await api.post('/firebase-login', {
      firebaseToken: firebaseToken,
    });

    // 2. Pega o token retornado pelo backend
    const backendToken = response.data.token; 
    
    if (backendToken) {
      // 3. Salva o token do backend de forma segura
      await SecureStore.setItemAsync('backend_token', backendToken);
      console.log('[authService] Token do backend salvo com sucesso!');
      return true; // Sucesso!
    }

    // Se o backend não retornar um token por algum motivo
    console.error('[authService] O backend não retornou um token.');
    return false;

  } catch (error) {
    console.error('[authService] Erro ao trocar o token do Firebase:', error);
    // Garante que qualquer token antigo seja removido em caso de erro
    await SecureStore.deleteItemAsync('backend_token'); 
    return false; // Falha!
  }
};


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
    // 1. FAZ O LOGIN NO FIREBASE (seu código original)
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // PEGA O TOKEN DO FIREBASE DO USUÁRIO LOGADO
    const firebaseIdToken = await user.getIdToken();

    const backendAuthSuccess = await exchangeFirebaseToken(firebaseIdToken);

    //VERIFICA SE A AUTENTICAÇÃO NO BACKEND DEU CERTO
    if (!backendAuthSuccess) {
      await signOut(auth); 
      throw new Error("Falha na autenticação com o servidor.");
    }

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const nomeSocial = userData.nomeSocial;

      // Salva o nome social no AsyncStorage somente após o login
      await AsyncStorage.setItem('userNomeSocial', nomeSocial);

      return { ...user, nomeSocial: nomeSocial };
    } else {
      // Se não achar os dados, também desloga para evitar inconsistência
      await signOut(auth);
      throw new Error("Dados do usuário não encontrados.");
    }
  } catch (error) {
    // Apenas repassa o erro para a tela de Login tratar
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
  await SecureStore.deleteItemAsync('backend_token');
    console.log('[authService] Token do backend removido durante o logout.');
}

// Atualizar senha
export async function changeUserPassword(user: User, newPassword: string) {
  if (!newPassword.trim()) throw new Error("Senha não pode estar vazia");
  await updatePassword(user, newPassword);
}

export async function updateUserProfile(user: User, updates: { displayName?: string, photoURL?: string }) {
  if (!user) throw new Error("Usuário não autenticado.");

  const { displayName, photoURL } = updates;

  try {
    // 1. Atualiza o perfil no Firebase Auth (displayName e photoURL)
    await updateProfile(user, { displayName, photoURL });

    // 2. Atualiza o Firestore (Nome Social e salva no AsyncStorage)
    const userDocRef = doc(db, "users", user.uid);
    const firestoreUpdates: { nomeSocial?: string } = {};

    if (displayName) {
      firestoreUpdates.nomeSocial = displayName;
      await AsyncStorage.setItem('userNomeSocial', displayName);
    }
    
    // Se houver campos para atualizar no Firestore, chame updateDoc
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