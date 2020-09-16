export * from "./action";

import { Character } from "../database/character";
import movement from "./movement";
import { Trie } from "../trie";

import { readFile } from "fs";
import { safeLoad } from "js-yaml";

export class CommandList {
  trie = new Trie();
  commands: { [text: string]: Command } = {};

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
            if (this.commands[text]) {
              console.warn(`Collision when adding ${text}`);
              return;
            }
            //            this.addCommand(text, commandEntry);
            this.commands[text] = commandEntry;
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
    const results = this.trie.searchFor(commandText);
    let command: Command | undefined = undefined;
    if (results) {
      if (!results.found) {
        // no exact match
        const lookup = this.trie.allWordsFrom(results.node);
        switch (lookup.length) {
          case 0:
            console.log("No match.");
            break;
          case 1:
            command = this.commands[lookup[0].phrase];
            break;
          default:
            console.log(
              "Did you mean",
              lookup.map((command) => command.phrase).join(", ")
            );
        }
      } else {
        command = this.commands[results.node.phrase];
      }
    }
    if (command) {
      console.log("Match:", command);
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
