import { Mobile } from "./mobile";
import { Item } from "./item";
import { Player } from "./player";

export class Contents<T extends Mobile | Item | Player> {
  private things: Set<T> = new Set();

  public add(thing: T) {
    this.things.add(thing);
  }

  public remove(thing: T) {
    this.things.delete(thing);
  }

  public has(thing: T) {
    return this.things.has(thing);
  }
}
