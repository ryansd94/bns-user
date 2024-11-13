import { initializeApp, getApp, getApps } from "firebase/app"
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut
} from "firebase/auth"
import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc
} from "firebase/firestore"
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAVvoTuwb55beJbxkPexiu84pLn84IiJws",
    authDomain: "bns-user.firebaseapp.com",
    projectId: "bns-user",
    storageBucket: "bns-user.appspot.com",
    messagingSenderId: "594973805903",
    appId: "1:594973805903:web:cf3924026b2829e06c893a",
    measurementId: "G-NBQGJJKR2D"
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore(app)
const signInWithGoogle = async (callBack) => {
    try {
        const auth = getAuth(app)
        const googleProvider = new GoogleAuthProvider()
        const res = await signInWithPopup(auth, googleProvider)
        const user = res.user
        console.log(user)
        callBack(user)
    } catch (err) {
        console.error(err)
        alert(err.message)
    }
}

const logOut = () => {
    const auth = getAuth(app)
    signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
}

export {
    signInWithGoogle,
    logOut
}