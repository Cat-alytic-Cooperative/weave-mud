import { Mobile } from "../database/mobile";
import { Player } from "../database/player";

export interface ActionParameters {
  actor: Player | Mobile;
  input: string;
  arguments: string[];
}
