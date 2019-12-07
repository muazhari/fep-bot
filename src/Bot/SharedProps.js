import Firebase from "../Services/Firebase";

class SharedPropsFactory {
  constructor() {
    this.store = new Proxy(this.store, {
      set: (obj, prop, newval) => {
        var oldval = obj[prop];
        console.log("set", oldval, obj, prop, newval);
        obj[prop] = newval;
        this.storeUpdateListener();
      },
      get: (obj, prop) => {
        console.log("get", obj, prop);
      }
    });
  }

  get(key) {
    if (key) {
      return this.store[key];
    } else {
      return this.store;
    }
  }

  storeUpdateListener() {
    Firebase.rdb.ref("SharedProps").set(this.store);
  }

  set(props) {
    Object.keys(props).forEach(key => {
      this.store[key] = {
        ...this.store[key],
        ...props[key]
      };
    });

    this.updateStore();
  }
}

const SharedProps = new SharedPropsFactory();

export {
  SharedProps
};
