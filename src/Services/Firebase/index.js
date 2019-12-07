import firebase from "firebase";
import firebaseConfig from "./Config/Firebase";

class Firebase {
  constructor(config) {
    this.app = firebase.initializeApp(config);
  }
}

export default new Firebase(firebaseConfig);
