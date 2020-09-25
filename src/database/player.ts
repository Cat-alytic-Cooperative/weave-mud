import { Character } from "./character";
import { Connection } from "./connection";

type PlayerId = string & { _type?: "player" };
export class Player extends Character {
  connection?: Connection;

  constructor() {
    super();
  }

  send(text: string) {
    this.connection?.send(text);
  }

  sendln(text: string) {
    this.connection?.send(text + "\r\n");
  }
}
