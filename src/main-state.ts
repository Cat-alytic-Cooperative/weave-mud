import { EventEmitter } from "events";

export interface State {
  [name: string]: any;
}

export class StateTracker extends EventEmitter {
  private _state: State = {};

  constructor(state?: StateTracker | State) {
    super();

    if (state instanceof StateTracker) {
      this._state = Object.assign({}, state.state);
    } else if (state) {
      this._state = Object.assign({}, state);
    }
  }

  public set(newState: State) {
    for (let [key, value] of Object.entries(newState)) {
      if (value === undefined) {
        delete this._state[key];
      } else {
        this._state[key] = value;
      }
    }

    this.emit("state-change", this._state, newState);
  }

  public empty() {
    this._state = {};
    this.emit("state-change", this._state, {});
  }

  get state() {
    return this._state;
  }
}
