import { Room } from "./database/room";
import { Item } from "./database/item";
import { Mobile } from "./database/mobile";

export class World {
  everything: { [id: string]: Item | Mobile | Room } = {};
}

