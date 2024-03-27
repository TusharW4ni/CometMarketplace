import { initializeApp } from 'firebase/app';
import {getAuth}  from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDHADXl71Ix-n-Bf1TWn6Wi3oDiXJDWwk0',
  authDomain: 'cometmarketplace-46be7.firebaseapp.com',
  projectId: 'cometmarketplace-46be7',
  storageBucket: 'cometmarketplace-46be7.appspot.com',
  messagingSenderId: '637931718375',
  appId: '1:637931718375:web:cde603e8b5b18314e14442',
  measurementId: 'G-16YG111J4H',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);