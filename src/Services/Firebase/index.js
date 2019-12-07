import admin from "firebase-admin";
import {firebaseConfig, firebaseAdminConfig, firebaseDataBaseURL} from "../../Config/Firebase";
import fs from "fs-extra";

class Firebase {
  constructor(config) {
    this.app = admin.initializeApp({
      credential: admin.credential.cert(JSON.stringify(firebaseAdminConfig)),
      dataBaseURL: firebaseDataBaseURL
    });
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
