import { PlayerState } from "./PlayerState";

export class PlayerStateMachine {
  private state = PlayerState.Idle;

  setReady() {
    this.state = PlayerState.Ready;
  }

  initialize(): boolean {
    if (this.state !== PlayerState.Ready) return false;
    this.state = PlayerState.Initialized;
    return true;
  }

  terminate() {
    this.state = PlayerState.Terminated;
  }

  isInitialized() {
    return this.state === PlayerState.Initialized;
  }

  canInitialize() {
    return this.state === PlayerState.Ready;
  }
}
