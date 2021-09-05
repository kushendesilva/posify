import * as firebase from "firebase";
import "@firebase/auth";
import "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZ7KTb0ycmkARU56FwZlESlH_cTClzDZA",
  authDomain: "posify-web.firebaseapp.com",
  databaseURL: "https://posify-web.firebaseio.com",
  projectId: "posify-web",
  storageBucket: "posify-web.appspot.com",
  messagingSenderId: "318364884216",
  appId: "1:318364884216:android:dfd72633ace389e1dbaf0d",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
