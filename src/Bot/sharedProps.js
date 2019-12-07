import Firebase from "../Services/Firebase";

class sharedPropsFactory {
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

const sharedProps = new sharedPropsFactory();

export {
  sharedProps
};