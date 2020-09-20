import { CommandActionOpts } from "./interpreter";

export function quit(params: CommandActionOpts) {
  console.log("Shutting down.");
  process.exit(0);
}
