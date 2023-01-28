import "firebase/storage";
import firebase from "firebase/app";

const firebaseConfig = {
    appId: process.env.REACT_APP_APP_ID,
    apiKey: process.env.REACT_APP_API_KEY,
    projectId: process.env.REACT_APP_PROJECT_ID,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGEING_SENDER_ID,
};

firebase.initializeApp(firebaseConfig);

export const storage = firebase.storage();

export default firebase;
