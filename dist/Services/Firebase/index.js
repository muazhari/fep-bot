"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _firebase = require("firebase");

var _firebase2 = _interopRequireDefault(_firebase);

var _Firebase = require("../../Config/Firebase");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Firebase {
  constructor(config) {
    this.app = _firebase2.default.initializeApp(config);
    this.db = this.app.firestore();
    this.initSetting();
  }

  initSetting() {
    this.fireStoreSetting();
  }

  fireStoreSetting() {
    this.db.settings({ timestampsInSnapshots: true });
  }
}

exports.default = new Firebase(_Firebase.firebaseConfig);
//# sourceMappingURL=index.js.map