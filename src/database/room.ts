import { Item } from "./item";
import { Thing } from "./thing";
import { Character } from "./character";
import { Exit } from "./exit";

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

  isVisibleTo(viewer: Character) {
    return true;
  }
}
