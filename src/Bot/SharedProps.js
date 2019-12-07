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

  set(props) {
    Object.keys(props).forEach(key => {
      this.store[key] = props[key];
    });
  }

  setById(props, id) {
    Object.keys(props).map(key => {
      this.store[id][key] = props[key];
    });
  }
}

const SharedProps = new SharedPropsFactory();

export {
  SharedProps
};
