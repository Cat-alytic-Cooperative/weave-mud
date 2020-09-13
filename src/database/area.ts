import { RoomId, RoomPrototype } from "./room";

export type AreaId = string & { _type?: "area" };
export class Area {
  id: AreaId = "";
  name = "";

  prototypes: {
    rooms: Map<RoomId, RoomPrototype>;
  } = {
    rooms: new Map(),
  };
}
