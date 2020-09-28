import { Player } from "./database/player";
import { loadWorld, world } from "./world";
import { loadCommands, interpret } from "./commands/interpreter";
import { loadConfiguration, configuration } from "./configuration";
import {
  Connection,
  ConsoleConnection,
  WebSocketConnection,
} from "./database/connection";
import { Telnet, Event } from "telnet-rxjs";
import express from "express";
import expressWs from "express-ws";

function load() {
  return Promise.all([loadCommands(), loadWorld(), loadConfiguration()]);
}

function initializeConsolePlayer() {
  const player = new Player();
  player.name = "Console";
  return player;
}

import { connectionMap } from "./database/connection";

console.log(process.env);

async function main() {
  try {
    console.log("Loading...");
    await load();

    console.log(configuration);
    console.log(world);

    const startingRoom = world.rooms[configuration.startingRoom];

    console.log("Ready!");
    if (process.env.WEAVE_CONSOLE) {
      const consoleConnection = new ConsoleConnection({
        input: [],
        output: [],
      });
      const consolePlayer = new Player();
      connectionMap.add(consolePlayer, consoleConnection);

      if (!startingRoom) {
        console.error("No starting room for " + configuration.startingRoom);
      } else {
        startingRoom.addToRoom(consolePlayer);
      }
      consoleConnection.start();
    }

    /*
     * Telnet server
     */
    if (process.env.WEAVE_TELNET) {
      const server = Telnet.server(9090);
      server
        .filter((event) => event instanceof Event.Connected)
        .subscribe((event: Event.Server) => {
          const connection = (event as Event.Connected).connection;
          console.log(
            "Connection received from",
            connection.socket.remoteAddress
          );
        });
      server
        .filter((event) => event instanceof Event.Disconnected)
        .subscribe((event: Event.Server) => {
          const connection = (event as Event.Disconnected).connection;
          console.log(
            "Connection closed from",
            connection.socket.remoteAddress
          );
        });
      server.start().then(() => {
        console.log(`Weave telnet server listening on port 9090`);
      });
    }

    /*
     * Express server
     */
    const app = expressWs(express()).app;

    app.ws("/ws", (ws, req) => {
      console.log(`Websocket connection from ${req.connection.remoteAddress}`);
      const connection = new WebSocketConnection({
        ws: ws,
        input: [],
        output: [],
      });
      let player: Player | undefined;

      ws.on("message", (msg) => {
        const data = JSON.parse(msg.toString());
        console.log("Websocket message", data);
        switch (data.type) {
          case "CONNECT":
            player = new Player();
            player.name = data.username;
            startingRoom.addToRoom(player);
            connectionMap.add(player, connection);
            ws.send(
              JSON.stringify({
                type: "HELLO",
              })
            );
            break;
        }
      });

      ws.on("close", (code, reason) => {
        console.log("Websocket close:", req.connection.remoteAddress);
        if (player) {
          startingRoom.removeFromRoom(player);
        }
        connectionMap.remove(connection);
      });

      connection.start();
    });

    app.use(express.static("public"));

    app.listen(process.env.PORT || 3000, () => {
      console.log(
        `Weave web server listening on port ${process.env.PORT || 3000}`
      );
    });

    let mainLoopTimeout = setInterval(() => {
      // Process input
      for (let [player, connection] of connectionMap.entries()) {
        let text = connection.input.shift();
        if (text) {
          interpret(player, text.trim());
        }
      }

      // Process output
      for (let [player, connection] of connectionMap.entries()) {
        connection.flush();
      }
    }, 100);
  } catch (e) {
    console.error(e);
  }
}

main();
