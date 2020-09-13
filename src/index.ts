import { Room, RoomPrototype } from "./database/room";
import { Player } from "./database/player";
import readLine from "readline";
import { World } from "./world";
import { CommandList } from "./command";

const world = new World();

const player = new Player();

const firstRoomPrototype = new RoomPrototype();
const firstRoom = firstRoomPrototype.create();
firstRoom.contents.add(player);
console.log(firstRoom);

const commandList = new CommandList();
/*
commandList.addCommand("look");
commandList.addCommand("move");
commandList.addCommand("get");
commandList.addCommand("say");
commandList.addCommand("emote");
commandList.addCommand("go");
commandList.addCommand("quit");
commandList.addCommand("inventory");
commandList.addCommand("attack");
commandList.addCommand("drop");
commandList.addCommand("wear");
commandList.addCommand("remove");
commandList.addCommand("east");
commandList.addCommand("west");
commandList.addCommand("south");
commandList.addCommand("north");
commandList.addCommand("e");
commandList.addCommand("w");
commandList.addCommand("s");
commandList.addCommand("n");
commandList.addCommand("up");
commandList.addCommand("down");
commandList.addCommand("u");
commandList.addCommand("d");
commandList.addCommand("group");
commandList.addCommand("commands");
commandList.addCommand("enter");
commandList.addCommand("exit");
commandList.addCommand("wield");
commandList.addCommand("hold");
commandList.addCommand("lock");
commandList.addCommand("unlock");
commandList.addCommand("pick");
commandList.addCommand("drink");
commandList.addCommand("assist");
commandList.addCommand("rescue");
commandList.addCommand("taunt");
commandList.addCommand("flee");
commandList.addCommand("kick");
commandList.addCommand("help");
commandList.addCommand("rest");
commandList.addCommand("sit");
commandList.addCommand("sleep");
commandList.addCommand("stand");
commandList.addCommand("tell");
commandList.addCommand("whisper");
*/

function load() {
  return Promise.all([commandList.loadCommands()]);
}

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function readFromConsole() {
  rl.question("> ", (answer) => {
    console.log(`"${answer}"`);
    let command = commandList.findCommand(answer.trim());
    if (!command) {
      console.log("No match.");
    } else if (Array.isArray(command)) {
      switch (command.length) {
        case 0:
          console.log("No match.");
          break;
        case 1:
          console.log("Perform:", command[0]);
          break;
        default:
          console.log(
            "Did you mean",
            command.map((command) => command.text).join(", ")
          );
      }
    } else {
      console.log("Perform:", command);
    }
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

