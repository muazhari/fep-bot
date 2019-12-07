import Firebase from "../Services/Firebase";

class SharedPropsFactory {
  constructor() {
    this.store = {};
  }

  get(key) {
    if (key) {
      return this.store[key];
    } else {
      return this.store;
    }
  }

  updateStore() {
    Firebase.rdb.ref("SharedProps").set(this.store);
  }

  set(props, id) {
    if (id) {
      Object.keys(props).map(key => {
        this.store[id][key] = {
          ...this.store[id][key],
          ...props[key]
        };
      });
    } else {
      Object.keys(props).forEach(key => {
        this.store[key] = {
          ...this.store[key],
          ...props[key]
        };
      });
    }
    this.updateStore();
  }
}

const SharedProps = new SharedPropsFactory();

export {
  SharedProps
};
