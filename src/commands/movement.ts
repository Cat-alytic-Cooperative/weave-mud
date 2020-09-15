import { Character } from "../database/character";
import { ActionLookupTable } from "./action";

const movementLookup: ActionLookupTable = {
  move(params) {
    console.log("move:", params.arguments[0]);
  },
  east(params) {
    params.arguments = ["east"];
    this.move(params);
  },
  west(params) {
    params.arguments = ["west"];
    this.move(params);
  },
  north(params) {
    params.arguments = ["north"];
    this.move(params);
  },
  south(params) {
    params.arguments = ["south"];
    this.move(params);
  },
  up(params) {
    params.arguments = ["up"];
    this.move(params);
  },
  down(params) {
    params.arguments = ["down"];
    this.move(params);
  },
  enter(params) {
    params.arguments = ["enter"];
    this.move(params);
  },
  exit(params) {
    params.arguments = ["exit"];
    this.move(params);
  },
};
export default movementLookup;
