import { Room } from "./room";
export interface ExitConstructorOpts {
  name: string;
  description?: string;
  location: Room;
  destination: Room;
}

export class Exit {
  name = "";
  description = "";
  location: Room;
  destination: Room;

  constructor(opts: ExitConstructorOpts) {
    this.name = opts.name;
    this.description = opts.description ?? "";
    this.location = opts.location;
    this.destination = opts.destination;
  }
}
