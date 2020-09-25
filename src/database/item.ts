import { Contents } from "./contents";
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

export interface ItemConstructorOpts {
  prototype?: Item;
}

export class Item extends Thing<Item> {
  type = ItemType.UNKNOWN;
  names: string[] = [];
  contents?: Contents<Item>;
  location?: Room | Item | Character;

  constructor(opts: ItemConstructorOpts) {
    super(opts);
  }

  isVisibleTo(viewer:Character) {
    return true;
  }
}
