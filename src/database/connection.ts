import readLine from "readline";
import { Player } from "./player";
import * as ws from "ws";

export interface ConnectionConstructorOpts {
  input: string[];
  output: string[];
}

export abstract class Connection {
  input: string[];
  output: string[];
  player?: Player;

  constructor({ input, output }: ConnectionConstructorOpts) {
    this.input = input;
    this.output = output;
  }
  send(text: string): boolean | void {
    this.output.push(text);
  }
  abstract flush(): Promise<boolean>;
  abstract start(): void;
}

export class ConsoleConnection extends Connection {
  flush() {
    return new Promise<boolean>((resolve, reject) => {
      this.output.forEach((text) => console.log(text));
      this.output.length = 0;
      resolve(true);
    });
  }

  start() {
    const rl = readLine.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const readFromConsole = () => {
      rl.question("> ", (answer) => {
        console.log(answer);
        this.input.push(answer);
        readFromConsole();
      });
    };

    readFromConsole();
  }
}

export interface WebSocketConnectionConstructorOpts
  extends ConnectionConstructorOpts {
  ws: ws;
}

export class WebSocketConnection extends Connection {
  ws: ws;

  constructor(opts: WebSocketConnectionConstructorOpts) {
    super(opts);

    this.ws = opts.ws;
  }

  flush() {
    return new Promise<boolean>((resolve, reject) => {
      if (this.output.length) {
        this.ws.send(
          JSON.stringify({
            type: "OUTPUT",
            lines: this.output,
          })
        );
        this.output.length = 0;
      }
      resolve(true);
    });
  }
  start() {
    this.ws.on("message", (data) => {
      const msg = JSON.parse(data.toString());
      console.log(msg);
      switch (msg.type) {
        case "INPUT":
          this.input.push(msg.text);
          break;
      }
    });
  }
}

export class TelnetConnection extends Connection {
  flush() {
    return Promise.resolve(true);
  }
  start() {}
}

export const connectionMap = {
  connections: new Map<Player, Connection>(),
  players: new Map<Connection, Player>(),
  entries: function () {
    return this.connections.entries();
  },
  add: function (player: Player, connection: Connection) {
    player.connection = connection;
    connection.player = player;
    this.players.set(connection, player);
    this.connections.set(player, connection);
  },
  remove: function (thing: Player | Connection) {
    if (thing instanceof Player) {
      this.connections.delete(thing);
      if (thing.connection) {
        this.players.delete(thing.connection);
      }
    } else {
      this.players.delete(thing);
      if (thing.player) {
        this.connections.delete(thing.player);
      }
    }
  },
  has(thing: Player | Connection) {
    if (thing instanceof Player) {
      return this.connections.has(thing);
    } else {
      return this.players.has(thing);
    }
  },
};
