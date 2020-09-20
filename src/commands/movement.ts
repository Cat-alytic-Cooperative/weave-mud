import e from "express";
import { Character } from "../database/character";
import { ActionLookupTable } from "./action";

const movementLookup: ActionLookupTable = {
  move({ actor, input, parameters }) {
    console.log("move:", parameters);
    if (!parameters) {
      return actor.send("Go where?");
    }

    if (!actor.location) {
      return console.error(`${actor} is not in a location`);
    }

    const direction = parameters[0];
    const exit = actor.location.exits.get(direction);
    if (!exit) {
      return actor.send("You cannot go in that direction.");
    }

    actor.location.removeFromRoom(actor);
    exit.destination.addToRoom(actor);
  },
  east(params) {
    params.parameters = ["east"];
    this.move(params);
  },
  west(params) {
    params.parameters = ["west"];
    this.move(params);
  },
  north(params) {
    params.parameters = ["north"];
    this.move(params);
  },
  south(params) {
    params.parameters = ["south"];
    this.move(params);
  },
  up(params) {
    params.parameters = ["up"];
    this.move(params);
  },
  down(params) {
    params.parameters = ["down"];
    this.move(params);
  },
  enter(params) {
    params.parameters = ["enter"];
    this.move(params);
  },
  exit(params) {
    params.parameters = ["exit"];
    this.move(params);
  },
};
export default movementLookup;
