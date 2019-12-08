import Store from "../Services/Store";
import fs from "fs-extra";
import mkdirp from "mkdirp";
import path from "path";
import uuid from "uuid";

import config from "../Config/Line";

import Firebase from "../Services/Firebase";
import observe from "observe";

class SharedPropsFactory {
  constructor() {
    this.store = {};
    // this.store = observe({});
    // this.store = new Proxy({}, {
    //   set: this._set,
    //   get: this._get
    // });
    // this.store.on("change", change => {
    //   this.storeUpdateListener();
    // });
  }

  log(sourceId) {
    new Promise((resolve, reject) => {
      if (sourceId) {
        Firebase.fdb.collection("Props").add(this.store[sourceId]);
        console.log("[SharedProps] Props logged", sourceId, new Date());
      }
      Firebase.fdb.collection("Store").add(this.store);
      console.log("[SharedProps] Store logged", new Date());
    });
  }

  storeUpdateListener() {
    Firebase.rdb.ref("SharedProps").set(this.store);
    console.log("[SharedProps] Store updated", new Date());
  }
}

const SharedProps = new SharedPropsFactory();

export {
  SharedProps
};
