import Store from "../Services/Store";
import fs from "fs-extra";
import mkdirp from "mkdirp";
import path from "path";
import uuid from "uuid";

import config from "../Config/Line";

import Firebase from "../Services/Firebase";
import observe from "observe";

const copySet = (newObj, oldObj) => {
  let temp = {};
  const keys = Object.keys(newObj);

  if (keys <= 0) {
    return old;
  } else {
    keys.forEach(k => {
      temp[k] = {
        ...oldObj[k],
        ...copySet(newObj[k])
      };
    });
  }

  return temp;
};

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

  set(newObj) {
    const copySet = (newObj, oldObj) => {
      let temp = {};
      const newObjKeys = Object.keys(newObj);
      const oldObjKeys = Object.keys(oldObj);

      if (newObjKeys.length <= 0) { //base case kalau itu paling bottom, (value)
        return newObj;
      } else {
        newObjKeys.forEach(k => {
          // karena hashmap gabisa langsung assign tanpa key sebelumnya, jadi ditravel
          temp[k] = {
            ...oldObj[k],
            ...copySet(newObj[k], oldObj[k])
          };
        });
      }

      return temp;
    };

    this.store = copySet(newObj, this.store);
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
