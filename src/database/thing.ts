import { v4 } from "uuid";
import { Zone } from "./zone";

export interface ThingOpts {
  id: string;
  name: string;
  zone?: Zone;
  prototype?: Thing<any>;
}

export interface ThingConstructorOpts<T> {
  prototype?: T;
  id?: string;
}

export class Thing<T extends ThingOpts> {
  id = "";
  name = "";
  prototype?: T;
  zone?: Zone;

  constructor(opts?: ThingConstructorOpts<T>) {
    this.prototype = opts?.prototype;
    this.id =
      opts?.id ?? (this.prototype ? this.prototype.id + "__" + v4() : v4());
  }
}
