import { Character } from "./character";

export interface MobileConstructorOpts {
  prototype?: Mobile;
}
export class Mobile extends Character {
  constructor(opts: MobileConstructorOpts) {
    super(opts);
  }
}
