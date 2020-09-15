import { ActionLookupTable } from "./action";

const informationLookup: ActionLookupTable = {
  look(params) {
    console.log("look:", params.arguments[0]);
  },
};
export default informationLookup;
