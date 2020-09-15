import { Room } from "./database/room";
import { Item } from "./database/item";
import { Mobile } from "./database/mobile";

export class World {
  everything: { [id: string]: Item | Mobile | Room } = {};

  add(item: Room | Item | Mobile) {
    this.everything[item.id] = item;
  }

  remove(item: Room | Item | Mobile) {
    delete this.everything[item.id];
  }

  has(item: Room | Item | Mobile) {
    return !!this.everything[item.id];
  }
}
