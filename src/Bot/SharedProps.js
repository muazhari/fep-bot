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
      this.
    });
  }

  _set(obj, prop, newVal) {
    const oldval = obj[prop];
    console.log("set", oldval, obj, prop, newval);
    obj[prop] = newVal;
    this.storeUpdateListener();
  }

  _get(obj, prop) {
    console.log("get", obj, prop);
    // return obj[prop];
  }

  log() {
    new Promise(async (resolve, reject) => {
      // const val = {
      //   [this.props.event.timestamp]: this.props
      // };
      // let data = await Store.getStore("propsLogs");
      // if (data === undefined) {
      //   data = [val];
      // } else {
      //   data.push(val);
      // }
      // await Store.setStore(val);
      Firebase.fdb.collection("Props").add(this.props);
      console.log("[LOG] Props logged", this.props.event.timestamp);
    });
  }

  storeUpdateListener() {
    Firebase.rdb.ref("SharedProps").set(this.store);
  }
}

const SharedProps = new SharedPropsFactory();

export {
  SharedProps
};
