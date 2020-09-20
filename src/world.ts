import { Room, RoomId } from "./database/room";
import { Item } from "./database/item";
import { Mobile } from "./database/mobile";

import { readFile } from "fs";
import { safeLoad } from "js-yaml";
import { Zone } from "./database/zone";
import { Exit } from "./database/exit";

export type WorldParts = Room | Item | Mobile;

export class World {
  everything: { [id: string]: WorldParts } = {};
  rooms: { [id: string]: Room } = {};

  add(item: WorldParts) {
    this.everything[item.id] = item;
    if (item instanceof Room) {
      this.rooms[item.id] = item;
    }
  }

  remove(item: WorldParts) {
    delete this.everything[item.id];
    if (item instanceof Room) {
      delete this.rooms[item.id];
    }
  }

  has(item: WorldParts) {
    return !!this.everything[item.id];
  }
}

export const world = new World();

export interface WorldFileExit {
  name?: string;
  description?: string;
  destination: string;
}

export interface WorldFileRoom {
  id: string;
  name: string;
  description: string;
  zone?: string;
  exits: { [name: string]: string | WorldFileExit };
}

export interface WorldFileZone {
  id: string;
  name: string;
  rooms?: WorldFileRoom[];
}

export interface WorldFile {
  zones?: WorldFileZone[];
  rooms?: WorldFileRoom[];
}

function loadZone(entry: WorldFileZone) {
  const zone = new Zone();
  zone.id = entry.id ?? zone.id;
  zone.name = entry.name;
  return zone;
}

function loadRoom(entry: WorldFileRoom) {
  const room = new Room();
  room.id = entry.id ?? room.id;
  room.name = entry.name;
  room.description = entry.description || "";

  if (entry.exits) {
    for (let [direction, exit] of Object.entries(entry.exits)) {
      if (typeof exit === "string") {
        room.exits.set(
          direction,
          new Exit({
            name: direction,
            location: room,
            destination: new Room({ id: exit }),
          })
        );
      } else {
        room.exits.set(
          direction,
          new Exit({
            name: exit.name || direction,
            description: exit.description,
            location: room,
            destination: new Room({ id: exit.destination }),
          })
        );
      }
    }
  }
  return room;
}

function checkExits() {
  for (let room of Object.values(world.rooms)) {
    for (let exit of room.exits.values()) {
      const destinationId = exit.destination.id;
      if (!world.rooms[destinationId]) {
        console.error(`No room with ID ${destinationId}`);
        room.exits.delete(exit.name);
        continue;
      }

      exit.destination = world.rooms[destinationId];
    }
  }
}

export function loadWorld() {
  return new Promise<boolean>((resolve, reject) => {
    readFile("./data/world/world.yaml", { encoding: "utf8" }, (err, data) => {
      if (err) {
        return reject(err);
      }

      let yaml = safeLoad(data) as WorldFile | undefined;
      if (!yaml) {
        return reject("No world data in world file");
      }

      console.log(yaml);

      if (yaml.zones) {
        yaml.zones.forEach((zoneEntry) => {
          const newZone = loadZone(zoneEntry);
          if (zoneEntry.rooms) {
            zoneEntry.rooms.forEach((roomEntry) => {
              const newRoom = loadRoom(roomEntry);
              newRoom.zone = newZone;
              world.add(newRoom);
            });
          }
        });
      }

      resolve(true);
    });
  });
}
