import { Room, RoomPrototype } from "./database/room";
import { Player } from "./database/player";
import readLine from "readline";
import { loadWorld, world } from "./world";
import { loadCommands, interpret } from "./commands/interpreter";
import { loadConfiguration, configuration } from "./configuration";

const player = new Player();
player.name = "Console";

function load() {
  return Promise.all([loadCommands(), loadWorld(), loadConfiguration()]);
}

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function readFromConsole() {
  rl.question("> ", (answer) => {
    console.log(`"${answer}"`);
    interpret(player, answer);
    readFromConsole();
  });
}

function initializeConsolePlayer() {
  const player = new Player();
  player.name = "Console";
  return player;
}

async function main() {
  try {
    console.log("Loading...");
    await load();

    console.log(configuration);
    console.log(world);

    const startingRoom = world.rooms[configuration.startingRoom];
    if (!startingRoom) {
      console.error("No starting room for " + configuration.startingRoom);
    } else {
      startingRoom.addToRoom(player);
    }

    console.log("Ready!");
    readFromConsole();
  } catch (e) {
    console.error(e);
  }
}

main();
