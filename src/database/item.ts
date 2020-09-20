import { Contents } from "./contents";
import { v4 } from "uuid";
import { Zone } from "./zone";
import { Thing } from "./thing";
import { Character } from "./character";
import { Room } from "./room";

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

export class Item extends Thing<Item> {
  type = ItemType.UNKNOWN;
  names: string[] = [];
  contents?: Contents<Item>;
  location?: Room | Item| Character;

  constructor(opts: ItemConstructorOpts) {
    super(opts);
  }
}
