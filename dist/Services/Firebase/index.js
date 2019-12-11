"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _firebaseAdmin = require("firebase-admin");

var _firebaseAdmin2 = _interopRequireDefault(_firebaseAdmin);

var _firebaseFunctions = require("firebase-functions");

var _firebaseFunctions2 = _interopRequireDefault(_firebaseFunctions);

var _Firebase = require("../../Config/Firebase");

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _child_process = require("child_process");

var _child_process2 = _interopRequireDefault(_child_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Firebase {
  constructor(config) {
    this.app = this.initApp(config);
    this.fdb = this.app.firestore();
    this.rdb = this.app.database();

    this.initSetting();
  }

  initApp(config) {
    const serviceAccountKeyFile = "serviceAccountKey.json";
    const serviceAccountKeyPath = _path2.default.join(__dirname, "../../../src/Config", `${serviceAccountKeyFile}`);
    //     const serviceAccountKeyPath = path.join(__dirname, "../../../src/Config", `${serviceAccountKeyFile}`);
    // const serviceAccountKeyData = JSON.stringify(config.firebaseAdminConfig);
    // fs.writeFile(serviceAccountKeyPath, serviceAccountKeyData, "utf8");
    return _firebaseAdmin2.default.initializeApp({ credential: _firebaseAdmin2.default.credential.cert(serviceAccountKeyPath), databaseURL: config.firebaseDatabaseURL });
  }

  initSetting() {
    this.fireStoreSetting();
  }

  fireStoreSetting() {
    this.fdb.settings({ timestampsInSnapshots: true });
  }
}

exports.default = new Firebase({ firebaseAdminConfig: _Firebase.firebaseAdminConfig, firebaseDatabaseURL: _Firebase.firebaseDatabaseURL });
//# sourceMappingURL=index.js.map