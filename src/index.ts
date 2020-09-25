import { Player } from "./database/player";
import { loadWorld, world } from "./world";
import { loadCommands, interpret } from "./commands/interpreter";
import { loadConfiguration, configuration } from "./configuration";
import { Connection, ConsoleConnection } from "./database/connection";

function load() {
  return Promise.all([loadCommands(), loadWorld(), loadConfiguration()]);
}

function initializeConsolePlayer() {
  const player = new Player();
  player.name = "Console";
  return player;
}

import { connectionMap } from "./database/connection";

async function main() {
  try {
    console.log("Loading...");
    await load();

    console.log(configuration);
    console.log(world);

    const startingRoom = world.rooms[configuration.startingRoom];

    console.log("Ready!");
    const consoleConnection = new ConsoleConnection({ input: [], output: [] });
    const consolePlayer = new Player();
    consolePlayer.connection = consoleConnection;
    consoleConnection.player = consolePlayer;
    connectionMap.add(consolePlayer, consoleConnection);

    if (!startingRoom) {
      console.error("No starting room for " + configuration.startingRoom);
    } else {
      startingRoom.addToRoom(consolePlayer);
    }

    let mainLoopTimeout = setInterval(() => {
      // Process input
      for (let [player, connection] of connectionMap.entries()) {
        let text = connection.input.shift();
        if (text) {
          interpret(player, text);
        }
      }

      // Process output
      for (let [player, connection] of connectionMap.entries()) {
        connection.flush();
      }
    }, 100);

    consoleConnection.start();
  } catch (e) {
    console.error(e);
  }
}

main();
