import { initializeApp } from "firebase/app";
import { initializeAuth} from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyD0dNfimXdgEU-mhDoxtGGpWovZIXykYts",
  authDomain: "mottu-codecraftes.firebaseapp.com",
  projectId: "mottu-codecraftes",
  storageBucket: "mottu-codecraftes.firebasestorage.app",
  messagingSenderId: "737000542758",
  appId: "1:737000542758:web:966899d4b3facf88954ce7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export{auth}
