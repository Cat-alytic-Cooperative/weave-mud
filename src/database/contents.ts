import { Mobile } from "./mobile";
import { Item } from "./item";
import { Player } from "./player";

export class Contents<T extends Mobile | Item | Player> {
  private things: Map<string, T> = new Map();

  public add(thing: T) {
    if (this.things.has(thing.id)) {
      return;
    }
    this.things.set(thing.id, thing);
  }

  public remove(thing: T) {
    if (!this.things.has(thing.id)) {
      return;
    }

    this.things.delete(thing.id);
  }

  public has(thing: T) {
    return this.things.has(thing.id);
  }
}
