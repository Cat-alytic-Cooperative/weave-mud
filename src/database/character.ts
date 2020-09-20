import { Contents } from "./contents";
import { Item } from "./item";
import { Room } from "./room";
import { Thing } from "./thing";

export class Character extends Thing<Character> {
  name = "";
  inventory = new Contents<Item>();
  location?: Room;

  send(text: string) {}

  sendln(text: string) {}
}
