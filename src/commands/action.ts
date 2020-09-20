import { Character } from "../database/character";

export interface ActionParameters {
  actor: Character;
  input: string;
  parameters: string[];
}

export interface ActionLookupTable {
  [name: string]: (params: ActionParameters) => void;
}
