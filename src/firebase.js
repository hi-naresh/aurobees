import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA5cR7pxi4rGX-ghekoVkhJnLvhtZ5QCo4",
  authDomain: "abees-5a485.firebaseapp.com",
  databaseURL: "https://abees-5a485-default-rtdb.firebaseio.com",
  projectId: "abees-5a485",
  storageBucket: "abees-5a485.appspot.com",
  messagingSenderId: "106794533833",
  appId: "1:106794533833:web:afa25c2d9ce8d6b93f9e18",
  measurementId: "G-GKSJYRMVFF"
};

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  export const database = firebaseApp.firestore();
  export const auth = firebaseApp.auth();
  export const storage = firebaseApp.storage();


  export { firebase }; // Export firebase
  export default database;