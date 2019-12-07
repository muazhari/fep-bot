import Firebase from "../Services/Firebase";

class sharedProps {
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
}

export default new sharedProps();