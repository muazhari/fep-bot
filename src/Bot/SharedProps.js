import Firebase from "../Services/Firebase";

class SharedPropsFactory {
  constructor() {
    this.store = {};
    // this.store = new Proxy({}, {
    //   set: this._set,
    //   get: this._get
    // });
  }

  _set(obj, prop, newVal) {
    const oldval = obj[prop];
    console.log("set", oldval, obj, prop, newval);
    obj[prop] = newVal;
    this.storeUpdateListener();
    return true;
  }

  _get(obj, prop) {
    console.log("get", obj, prop);
    return obj[prop];
  }

  storeUpdateListener() {
    Firebase.rdb.ref("SharedProps").set(this.store);
  }
}

const SharedProps = new SharedPropsFactory();

export {
  SharedProps
};
