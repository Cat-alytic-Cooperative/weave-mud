import { readFile } from "fs";
import { safeLoad } from "js-yaml";

export class CommandListNode {
  children: { [letter: string]: CommandListNode } = {};
  letter = "";
  command?: Command;
}

export class CommandList {
  root = new CommandListNode();

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
          });
        });
        resolve(true);
      });
    });
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
