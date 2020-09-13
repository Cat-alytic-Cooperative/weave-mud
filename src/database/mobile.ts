import { Contents } from "./contents";
import { Item } from "./item";
import { Character } from "./character";
import { v4 } from "uuid";

export type MobileId = string & { _type?: "mobile" };
export class MobilePrototype {
  id: MobileId = "";

  constructor() {
    this.id = v4();
  }

  create() {
    return new Mobile({ prototype: this, id: v4() });
  }
}

export interface MobileConstructorOpts {
  prototype: MobilePrototype;
  id: MobileId;
}
export class Mobile extends Character {
  prototype: MobilePrototype;
  id: MobileId;

  constructor(opts: MobileConstructorOpts) {
    super();
    this.prototype = opts.prototype;
    this.id = opts.id;
  }
}
