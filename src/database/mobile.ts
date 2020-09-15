import { Contents } from "./contents";
import { Item } from "./item";
import { Character } from "./character";
import { v4 } from "uuid";
import { Zone } from "./zone";

export type MobileId = string & { _type?: "mobile" };
export class MobilePrototype {
  id: MobileId = "";

  constructor() {
    this.id = v4();
  }

  create() {
    //    return new Mobile({ prototype: this, id: v4() });
  }
}

export interface MobileConstructorOpts {
  prototype?: Mobile;
}
export class Mobile extends Character {
  prototype?: Mobile;
  id: MobileId;
  zone?: Zone;

  constructor(opts: MobileConstructorOpts) {
    super();
    this.prototype = opts.prototype;
    this.id = this.prototype ? this.prototype.id + "." + v4() : v4();
  }
}
