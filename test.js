class House {
  #cost;
  constructor({ cost, name }) {
    this.#cost = cost;
    this.name = name;
  }
  get cost(){return this.#cost;}
}


const obj1 = new House({ cost: 0, name: "woo" });
if(obj1 instanceof Number) console.log(obj1);

// console.log(obj2); // false
