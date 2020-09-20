import { ActionLookupTable } from "./action";

const informationLookup: ActionLookupTable = {
  look({ actor, input, parameters }) {
    console.log("look:", parameters);
    if (!parameters.length) {
      // Looking at the room the actor is currently in
      if (!actor.location) {
        console.warn(`${actor.name} is not in a location.`);
        return;
      }

      actor.send(actor.location.name);
      actor.send(actor.location.description);
      actor.send(
        "Exits: [ " +
          (actor.location.exits.size
            ? [...actor.location.exits.keys()].join(", ")
            : "None") +
          " ]"
      );
    }
  },
};
export default informationLookup;
