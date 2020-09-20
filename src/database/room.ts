import { Mobile } from "./mobile";
import { Item } from "./item";
import { Contents } from "./contents";
import { Player } from "./player";
import { v4 } from "uuid";
import { Zone } from "./zone";
import { Thing, ThingConstructorOpts } from "./thing";
import { Character } from "./character";
import { Exit } from "./exit";

export type RoomId = string & { _type?: "room" };
export class RoomPrototype {
  id: RoomId = "";
  name = "";

  constructor() {
    this.id = v4();
  }
}

export interface RoomConstructorOpts {
  prototype?: Room;
  id?: string;
}
export class Room extends Thing<Room> {
  description = "";
  contents: Set<Item | Character> = new Set();
  exits: Map<string, Exit> = new Map();

  constructor(opts?: RoomConstructorOpts) {
    super(opts);
  }

  addToRoom(thing: Item | Character) {
    this.contents.add(thing);
    thing.location = this;
  }

  removeFromRoom(thing: Item | Character) {
    this.contents.delete(thing);
    thing.location = undefined;
  }
}
