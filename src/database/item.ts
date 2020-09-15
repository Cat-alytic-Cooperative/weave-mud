import { Contents } from "./contents";
import { v4 } from "uuid";
import { Zone } from "./zone";

export enum ItemType {
  CONTAINER,
  WEAPON,
  ARMOR,
  FOOD,
  DRINK,
  UNKNOWN,
}

export type ItemId = string & { _type?: "item" };
export class ItemPrototype {
  id: ItemId = "";
  type: ItemType = ItemType.UNKNOWN;

  constructor() {
    this.id = v4();
  }

  create() {
    /*    const newItem = new Item({ prototype: this, id: v4() });

    newItem.name = this.name;

    return newItem;*/
  }
}

export interface ItemConstructorOpts {
  prototype?: Item;
}

export class Item {
  type = ItemType.UNKNOWN;
  id: ItemId = "";
  names: string[] = [];
  zone?: Zone;
  prototype?: Item;
  contents?: Contents<Item>;

  constructor(opts: ItemConstructorOpts) {
    this.prototype = opts.prototype;
    this.id = this.prototype ? this.prototype.id + "." + v4() : v4();
  }
}
