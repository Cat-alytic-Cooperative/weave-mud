import { Contents } from "./contents";
import { Item } from "./item";

export class Character {
  inventory = new Contents<Item>();
}
