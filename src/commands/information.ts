import { ActionLookupTable } from "./action";
import { Position } from "../database/character";

const informationLookup: ActionLookupTable = {
  look({ actor, input, parameters }) {
    console.log("look:", parameters);

    if (actor.position < Position.SLEEPING) {
      return actor.send("All you see is starts.");
    }

    if (actor.position === Position.SLEEPING) {
      return actor.send("You cannot see anything. You are asleep.");
    }

    if (!parameters.length) {
      // Looking at the room the actor is currently in
      if (!actor.location) {
        return console.warn(`${actor.name} is not in a location.`);
      }

      if (actor.location.isVisibleTo(actor)) {
        actor.send(actor.location.name);
        actor.send(actor.location.description);
        actor.send(
          "Exits: [ " +
            (actor.location.exits.size
              ? [...actor.location.exits.entries()]
                  .filter((entry) => entry[1].isVisibleTo(actor))
                  .map((entry) => entry[0])
                  .join(", ")
              : "None") +
            " ]"
        );
      } else {
        actor.send("Where?");
        actor.send("You have no idea where you are.");
        actor.send("[ None ]");
      }
      return;
    }
  },
};
export default informationLookup;
