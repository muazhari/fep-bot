import admin from "firebase-admin";
import functions from "firebase-functions";
import {firebaseConfig, firebaseAdminConfig, firebaseDatabaseURL, firebaseAdminKeyPath} from "../../Config/Firebase";
import fs from "fs-extra";
import path from "path";
import cp from "child_process";

class Firebase {
  constructor(config) {
    this.app = this.initApp(config);
    this.fdb = this.app.firestore();
    this.rdb = this.app.database();

    this.initSetting();
  }

  initApp(config) {
    // const serviceAccountKeyData = JSON.stringify(config.firebaseAdminConfig);
    // fs.writeFile(serviceAccountKeyPath, serviceAccountKeyData, "utf8");
    return admin.initializeApp({
      credential: admin.credential.cert(config.firebaseAdminConfig),
      databaseURL: config.firebaseDatabaseURL
    });
  }

  initSetting() {
    this.fireStoreSetting();
  }

  fireStoreSetting() {
    this.fdb.settings({timestampsInSnapshots: true});
  }
}

export default new Firebase({firebaseAdminConfig, firebaseDatabaseURL});
