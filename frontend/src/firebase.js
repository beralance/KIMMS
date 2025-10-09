// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDqVCF3t3Yl4qvienEK3Ve9hiH0aXN4LJU",
    authDomain: "kimms-auth.firebaseapp.com",
    projectId: "kimms-auth",
    storageBucket: "kimms-auth.firebasestorage.app",
    messagingSenderId: "416446102181",
    appId: "1:416446102181:web:e79beea4cdcc9c467c2b4c",
    measurementId: "G-1S6QCY2DB2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider)
        console.log('User Info: ', result.user)
        return result.user;
    }
    catch (error) {
        console.error('Google Sign-in error: ', error)
        throw error;
    }
}

export const signupWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider)
        const user = result.user;

        return {
            email: user.email,
            fullName: user.displayName,
            avatar: user.photoURL,
            googleId: user.uid,
        }
    }
    catch (err) {
        console.error(err)
        throw new Error(err.message || 'Google signup failed')
    }
}

export const facebookProvider = new FacebookAuthProvider();