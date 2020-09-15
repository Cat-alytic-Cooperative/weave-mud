export * from "./action";

import { Character } from "../database/character";
import movement from "./movement";

import { readFile } from "fs";
import { safeLoad } from "js-yaml";
import { Trie } from "../trie";

export class CommandListNode {
  children: { [letter: string]: CommandListNode } = {};
  letter = "";
  command?: Command;
}

export class CommandList {
  root = new CommandListNode();
  trie = new Trie();

  addCommand(text: string, command: Command) {
    const letters = text.split("");
    let node = this.root;
    for (let index = 0; index < letters.length; ++index) {
      const letter = letters[index];
      if (!node.children[letter]) {
        node.children[letter] = new CommandListNode();
      }
      node = node.children[letter];
      node.letter = letter;
      if (index === letters.length - 1) {
        if (node.command) {
          console.error("Conflict when trying to add command:", text);
          console.error("Existing command: ", node.command);
          return false;
        }

        node.command = command;
        break;
      }
    }
    return true;
  }

  private breadthFirstCommandList(startingNode: CommandListNode) {
    const commandList: Command[] = [];
    const queue = [startingNode];
    while (true) {
      const currentNode = queue.shift();
      if (!currentNode) {
        break;
      }
      if (currentNode?.command) {
        commandList.push(currentNode.command);
      }
      const children = Object.values(currentNode.children);
      if (children.length > 0) {
        queue.push(...children);
      }
    }

    return commandList;
  }

  findCommand(command: string) {
    const letters = command.split("");
    let node = this.root;
    for (let index = 0; index < letters.length; ++index) {
      const letter = letters[index];
      if (!node.children[letter]) {
        return false;
      }
      node = node.children[letter];
      if (index === letters.length - 1) {
        if (node.command) {
          return node.command;
        }
        return this.breadthFirstCommandList(node);
      }
    }

    return false;
  }

  loadCommands() {
    return new Promise<boolean>((resolve, reject) => {
      readFile("./data/commands.yaml", { encoding: "utf8" }, (err, data) => {
        if (err) {
          return reject(err);
        }
        let yaml = safeLoad(data);
        if (!yaml) {
          return reject("No commands in data file");
        } else if (!Array.isArray(yaml)) {
          return reject("Invalid command file format");
        }
        let commands = yaml as CommandFileEntry[];
        console.log(commands);
        commands.forEach((command) => {
          const text = command.text;
          if (!Array.isArray(command.text)) {
            command.text = [command.text];
          }
          const commandEntry = new Command();
          commandEntry.text = command.text.join(", ");
          command.text.forEach((text) => {
            this.addCommand(text, commandEntry);
            this.trie.insert(text);
          });
        });
        resolve(true);
      });
    });
  }

  execute(actor: Character, command: Command) {
    console.log(`${actor.name} executing ${command}`);
  }

  interpret(actor: Character, text: string) {
    let commandParts = splitCommandArguments(text);
    console.log(commandParts);
    const commandText = commandParts.shift();
    if (!commandText) {
      console.warn("No command found after splitting " + text);
      console.log("No match");
      return;
    }
    const command = this.findCommand(commandText);
    const results = this.trie.searchFor(commandText);
    if (results) {
      console.log(results);
      if (!results.found) {
        // no exact match
        const lookup = this.trie.allWordsFrom(results.node);
        switch (lookup.length) {
          case 0:
            console.log("No match.");
            break;
          case 1:
            console.log("Match:", lookup[0]);
            break;
          default:
            console.log(
              "Did you mean",
              lookup.map((command) => command.phrase).join(", ")
            );
        }
      } else {
        console.log("Match:", results.node.phrase);
      }
    }
    if (!command) {
      console.log("No match.");
    } else if (Array.isArray(command)) {
      switch (command.length) {
        case 0:
          console.log("No match.");
          break;
        case 1:
          this.execute(actor, command[0]);
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
  }
}

export class Command {
  text = "";
  constructor() {}
}

export interface CommandFileEntry {
  text: string | string[];
  action: string;
}

const commandLookupTables = {
  movement,
};

function splitCommandArguments(text: string) {
  const isSpace = /\s/;
  if (text === null || text === undefined) {
    return [];
  }
  text = text.trim();
  if (text.length === 0) {
    return [];
  }

  let insideQuote = false;
  let argumentsIndex = 0;
  let lastWasSpace = false;
  const args: string[] = [];
  for (let index = 0; index < text.length; ++index) {
    const letter = text[index];

    if (letter === '"') {
      insideQuote = !insideQuote;
    } else {
      if (isSpace.test(letter)) {
        if (!insideQuote && !lastWasSpace) {
          argumentsIndex++;
        } else if (insideQuote) {
          if (
            args[argumentsIndex] === null ||
            args[argumentsIndex] === undefined
          ) {
            args[argumentsIndex] = "";
          }
          args[argumentsIndex] = args[argumentsIndex] + letter;
        }
        lastWasSpace = true;
      } else {
        if (
          args[argumentsIndex] === null ||
          args[argumentsIndex] === undefined
        ) {
          args[argumentsIndex] = "";
        }
        args[argumentsIndex] = args[argumentsIndex] + letter;
        lastWasSpace = false;
      }
    }
  }
  return args;
}
