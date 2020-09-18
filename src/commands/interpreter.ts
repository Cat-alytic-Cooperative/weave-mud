export * from "./action";

import { Character } from "../database/character";
import movement from "./movement";
import { Trie } from "../trie";

import { readFile } from "fs";
import { safeLoad } from "js-yaml";

const commandLookupTrie = new Trie();
const commands: Map<string, Command> = new Map();

export function loadCommands() {
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
      let commandFileList = yaml as CommandFileEntry[];
      console.log(commandFileList);
      commandFileList.forEach((commandFileEntry) => {
        let text = Array.isArray(commandFileEntry.text)
          ? commandFileEntry.text
          : [commandFileEntry.text];
        const commandEntry = new Command();
        commandEntry.text = text.join(", ");
        text.forEach((text) => {
          if (commands.has(text)) {
            console.warn(`Collision when adding ${text}`);
            return;
          }
          commands.set(text, commandEntry);
          commandLookupTrie.insert(text);
        });
      });
      resolve(true);
    });
  });
}

export function interpret(actor: Character, text: string) {
  let commandParts = splitCommandArguments(text);
  console.log(commandParts);
  const commandText = commandParts.shift();
  if (!commandText) {
    console.warn("No command found after splitting " + text);
    console.log("No match");
    return;
  }
  const results = commandLookupTrie.searchFor(commandText);
  let command: Command | undefined = undefined;
  if (results) {
    if (!results.found) {
      // no exact match
      const lookup = commandLookupTrie.allWordsFrom(results.node);
      switch (lookup.length) {
        case 0:
          console.log("No match.");
          break;
        case 1:
          command = commands.get(lookup[0].phrase);
          break;
        default:
          console.log(
            "Did you mean",
            lookup.map((command) => command.phrase).join(", ")
          );
      }
    } else {
      command = commands.get(results.node.phrase);
    }
  }
  if (command) {
    console.log("Match:", command);
  }
}

export interface ActionFunction {
  (opts: CommandActionOpts): void;
}

export function doNothing(opts: CommandActionOpts) {
  return;
}

export interface CommandActionOpts {
  actor: Character;
  originalText: string;
  parameters: string[];
}

export class Command {
  text = "";
  action: ActionFunction = doNothing;
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
