// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyAxj9cvG7iqMor1TUi75Y71orKm9JaXWU8',
	authDomain: 'midas-task-8ed57.firebaseapp.com',
	projectId: 'midas-task-8ed57',
	storageBucket: 'midas-task-8ed57.appspot.com',
	messagingSenderId: '791389759537',
	appId: '1:791389759537:web:52afe6a3a3371b385d4d10',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

export default app;
