import { Mobile } from "./mobile";
import { Item } from "./item";
import { Contents } from "./contents";
import { Player } from "./player";
import { v4 } from "uuid";

export type RoomId = string & { _type?: "room" };
export class RoomPrototype {
  id: RoomId = "";
  name = "";

  constructor() {
    this.id = v4();
  }

  public create() {
    return new Room({ prototype: this, id: v4() });
  }
}

export interface RoomConstructorOpts {
  prototype: RoomPrototype;
  id: string;
}
export class Room {
  prototype: RoomPrototype;
  id: RoomId = "";
  public readonly contents = new Contents<Mobile | Item | Player>();

  constructor(opts: RoomConstructorOpts) {
    this.prototype = opts.prototype;
    this.id = opts.id;
  }
}
