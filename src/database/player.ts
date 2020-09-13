import { Character } from "./character";
import { v4 } from "uuid";

type PlayerId = string & { _type?: "player" };
export class Player extends Character {
  id: PlayerId;
  
  constructor() {
    super();
    this.id = v4();
  }
}
