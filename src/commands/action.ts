import { Character } from "../database/character";

export interface ActionParameters {
  actor: Character;
  input: string;
  arguments: string[];
}

export interface ActionLookupTable {
  [name: string]: (params: ActionParameters) => void;
}
