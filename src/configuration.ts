import { readFile } from "fs";
import { safeLoad } from "js-yaml";
import { RoomId } from "./database/room";

export interface Configuration {
  startingRoom: RoomId;
}

export let configuration: Configuration = {
  startingRoom: "",
};

export function loadConfiguration() {
  return new Promise<boolean>((resolve, reject) => {
    readFile("./data/configuration.yaml", { encoding: "utf8" }, (err, data) => {
      if (err) {
        return reject(err);
      }

      let yaml = safeLoad(data) as Configuration | undefined;
      if (!yaml) {
        return reject("No configuration in configuration file");
      }

      configuration = yaml;

      resolve(true);
    });
  });
}
