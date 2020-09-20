import { Character } from "../database/character";
import { ActionLookupTable } from "./action";

const movementLookup: ActionLookupTable = {
  move(params) {
    console.log("move:", params.parameters[0]);
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
