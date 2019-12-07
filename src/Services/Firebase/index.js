import firebase from "firebase";
import firebaseConfig from "./Config/Firebase";

class Firebase {
  constructor(config) {
    this.app = firebase.initializeApp(config);
    this.db = this.app.firestore();
    this.initSetting();
  }

  initSetting() {
    this.fireStoreSetting();
  }

  fireStoreSetting() {
    this.db.settings({timestampsInSnapshots: true});
  }
}

export default new Firebase(firebaseConfig);
