import { Contents } from "./contents";
import { Item } from "./item";
import { Room } from "./room";
import { Thing } from "./thing";

export enum Position {
  DEAD,
  SLEEPING,
  RECLINING,
  SITTING,
  STANDING,
}

export enum EmitTarget {
  TO_CHARACTER,
  TO_SUBJECT,
  TO_ROOM,
  TO_NOT_SUBJECT,
  TO_CHARACTER_AND_SUBJECT,
}

const PRONOUNS = {
  subjective: ["it", "he", "she"],
  objective: ["it", "him", "her"],
  possession: ["its", "his", "her"],
};

export interface EmitOpts {
  subject?: Character;
  target?: EmitTarget;
  position?: Position;
}

export class Character extends Thing<Character> {
  name = "";
  inventory = new Contents<Item>();
  location?: Room;
  position: Position = Position.STANDING;

  send(text: string) {}

  sendln(text: string) {}

  isVisibleTo(viewer: Character) {
    if (viewer === this) return true;

    // Add affects (blind)
    // Add spells (invis)
    // Add skills (sneak)

    return true;
  }

  emit(opts: EmitOpts) {
    if (!this.location) {
      return;
    }

    opts.target = opts.target ?? EmitTarget.TO_CHARACTER;
    opts.position = opts.position ?? Position.RECLINING;

    for (let character of this.location.contents.values()) {
      if (!(character instanceof Character)) continue;

      if (character.position < opts.position) continue;

      switch (opts.target) {
        case EmitTarget.TO_CHARACTER:
          if (character !== this) continue;
          break;
        case EmitTarget.TO_SUBJECT:
          if (character !== opts.subject || character === this) continue;
          break;
        case EmitTarget.TO_ROOM:
          if (character === opts.subject) continue;
          break;
        case EmitTarget.TO_NOT_SUBJECT:
          if (character === this || character === opts.subject) continue;
          break;
        case EmitTarget.TO_CHARACTER_AND_SUBJECT:
          if (character !== this && character !== opts.subject) continue;
          break;
      }
    }
  }
}
