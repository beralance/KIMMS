import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup} from 'firebase/auth'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
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