import Firebase from "../Services/Firebase";

class SharedPropsFactory {
  constructor() {
    this.store = {};
    this.watch("store", (id, prev, next) => {
      this.storeUpdateListener();
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
