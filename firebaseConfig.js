import {initializeApp} from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getAuth} from "firebase/auth";

//import 'firebase/auth';


var firebaseConfig = {
    apiKey: "AIzaSyAnqfn7z1RywTFMzTZcT2Owx-6F63bjUls",
    authDomain: "kuatia-86c03.firebaseapp.com",
    projectId: "kuatia-86c03",
    storageBucket: "kuatia-86c03.appspot.com",
    messagingSenderId: "157595455454",
    appId: "1:157595455454:web:c4b40bc839f1779164174f",
    measurementId: "G-8GNS56RH34"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  
  export { app, auth };
