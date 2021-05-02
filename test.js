class House {
  #cost;
  constructor({ cost, name }) {
    this.#cost = cost;
    this.name = name;
  }
}
House.prototype.read = () => {
  this.name = "kol";
  return this.name;
}

const obj1 = new House({ cost: 10, name: "woo" });
console.log(obj1.read());

// console.log(obj2); // false
