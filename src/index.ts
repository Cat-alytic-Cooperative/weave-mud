import { Room, RoomPrototype } from "./database/room";
import { Player } from "./database/player";
import readLine from "readline";
import { World } from "./world";
import { loadCommands, interpret } from "./commands/interpreter";

const world = new World();

const player = new Player();

const firstRoomPrototype = new RoomPrototype();
const firstRoom = new Room();
firstRoom.contents.add(player);
firstRoom.name = "First Room";
console.log(firstRoom);

//const commandList = new CommandList();

function load() {
  return Promise.all([loadCommands()]);
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

async function main() {
  try {
    console.log("Loading...");
    await load();

    console.log("Ready!");
    readFromConsole();
  } catch (e) {
    console.error(e);
  }
}

main();
