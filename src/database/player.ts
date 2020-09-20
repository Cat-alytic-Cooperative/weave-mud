import { Character } from "./character";

type PlayerId = string & { _type?: "player" };
export class Player extends Character {
  constructor() {
    super();
  }

  send(text: string) {
    console.log(text);
  }

  sendln(text: string) {
    console.log(text);
    console.log("\n");
  }
}
