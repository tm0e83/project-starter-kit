// import { Dog } from "./dog";

export default class Worst {
  constructor(args) {
    console.log('worst init done');

    System.import('./dist/js/dog.js').then(_ => {
      const doggy = new Dog();
    });
    // const doggy = new Dog();
  }
}