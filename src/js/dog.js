class Dog {
  constructor(args) {
    this.sniff().then(_ => this.wait()).then(_ => this.bark());
  }

  wait() {
    return new Promise((resolve, reject) => {
      setTimeout(_ => resolve(), 1000);
    });
  }

  sniff() {
    return new Promise((resolve, reject) => {
      console.log('sniff');
      resolve();
    });
  }

  bark() {
    return new Promise((resolve, reject) => {
      console.log('woff woff');
      resolve();
    });
  }
}

export { Dog };