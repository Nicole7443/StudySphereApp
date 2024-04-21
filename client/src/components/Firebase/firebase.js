import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBsDpOax7aXXIgxL1T_t_Ocyjlc6Tten3M",
  authDomain: "study-sphere-ef8d4.firebaseapp.com",
  projectId: "study-sphere-ef8d4",
  storageBucket: "study-sphere-ef8d4.appspot.com",
  messagingSenderId: "434963001160",
  appId: "1:434963001160:web:b362268ce2750a995dcd7d",
  measurementId: "G-5Y7KMTBGS5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function logIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

function deleteCurrentFirebaseUser() {
  const user = auth.currentUser;
  if (user) {
    user.delete().then(() => {
      console.log('User deleted successfully');
    }).catch((error) => {
      console.error('Error deleting user:', error);
    });
  } else {
    console.log('No user is currently signed in.');
  }
}

function logOut() {
  return signOut(auth);
}

function googleSignIn() {
  const googleAuthProvider = new GoogleAuthProvider();
  return signInWithPopup(auth, googleAuthProvider);
}

export { auth, app, logIn, signUp, logOut, googleSignIn, deleteCurrentFirebaseUser };