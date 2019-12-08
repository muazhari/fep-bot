import Store from "../Services/Store";
import fs from "fs-extra";
import mkdirp from "mkdirp";
import path from "path";
import uuid from "uuid";

import config from "../Config/Line";

import Firebase from "../Services/Firebase";
import {watch} from "melanke-watchjs";

class SharedPropsFactory {
  constructor() {
    this.store = {};
    // this.store = new Proxy({}, {
    //   set: this._set,
    //   get: this._get
    // });

    watch(this.store, () => {
      this.storeUpdateListener();
    });
  }
  log(sourceId) {
    new Promise(async (resolve, reject) => {
      if (sourceId) {
        Firebase.fdb.collection("Props").add(this.store[sourceId]);
        console.log("[LOG] Props logged", sourceId, this.store[sourceId].event.timestamp);
      } else {
        Firebase.fdb.collection("Store").add(this.store);
        console.log("[LOG] Store logged", new Date());
      }
    });
  }

  storeUpdateListener() {
    Firebase.rdb.ref("SharedProps").set(this.store);
    console.log("[SharedStore] Store updated", new Date());
  }
}

const SharedProps = new SharedPropsFactory();

export {
  SharedProps
};
