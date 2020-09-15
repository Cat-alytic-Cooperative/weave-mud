import { Mobile } from "./mobile";
import { Item } from "./item";
import { Contents } from "./contents";
import { Player } from "./player";
import { v4 } from "uuid";
import { Zone } from "./zone";

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
}
export class Room {
  prototype?: Room;
  id: RoomId = "";
  name = "";
  zone?: Zone;
  public readonly contents = new Contents<Mobile | Item | Player>();

  constructor(opts?: RoomConstructorOpts) {
    this.prototype = opts?.prototype;
    this.id = this.prototype ? this.prototype.id + "." + v4() : v4();
  }
}
