import { Contents } from "./contents";
import { Item } from "./item";

export class Character {
  name = "";
  inventory = new Contents<Item>();
}
