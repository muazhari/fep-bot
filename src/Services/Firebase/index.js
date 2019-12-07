import admin from "firebase-admin";
import {firebaseConfig, firebaseAdminConfig, firebaseDataBaseURL} from "../../Config/Firebase";
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
    const serviceAccountKeyFile = "serviceAccountKey.json";
    const serviceAccountKeyPath = path.join(__dirname, "../../../src/Config", `${serviceAccountKeyFile}`);
    //     const serviceAccountKeyPath = path.join(__dirname, "../../../src/Config", `${serviceAccountKeyFile}`);
    //     const serviceAccountKeyData = JSON.stringify(config.firebaseAdminConfig);
    //     await fs.writeFile(serviceAccountKeyPath, serviceAccountKeyData, "utf8");
    return admin.initializeApp({credential: admin.credential.cert(serviceAccountKeyPath), dataBaseURL: config.firebaseDataBaseURL});
  }

  initSetting() {
    this.fireStoreSetting();
  }

  fireStoreSetting() {
    this.db.settings({timestampsInSnapshots: true});
  }
}

export default new Firebase({firebaseAdminConfig, firebaseDataBaseURL});
