class Object_1 {
  #data_1;
  #data_2;
  constructor() {
    this.#data_1 = "foo";
    this.#data_2 = "bar";
  }
  get data_1() {
    return this.#data_1;
  }
  get data_2() {
    return this.#data_2;
  }
}
console.log(new Object_1());
