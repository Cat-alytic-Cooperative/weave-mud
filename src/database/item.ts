import { Contents } from "./contents";
import { v4 } from "uuid";

export type ItemId = string & { _type?: "item" };
export class ItemPrototype {
  id: ItemId = "";

  constructor() {
    this.id = v4();
  }

  create() {
    return new Item({ prototype: this, id: v4() });
  }
}

export interface ItemConstructorOpts {
  prototype: ItemPrototype;
  id: ItemId;
}

export class Item {
  id: ItemId = "";
  prototype: ItemPrototype;

  constructor(opts: ItemConstructorOpts) {
    this.prototype = opts.prototype;
    this.id = opts.id;
  }
}

export class Weapon extends Item {}

export class Container extends Item {
  contents = new Contents<Item>();
}
