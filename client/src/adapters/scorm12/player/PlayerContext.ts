import { CmiModel } from "../cmi/CmiModel";
import { PlayerStateMachine } from "../state/PlayerStateMachine";
import { TimingController } from "../timing/TimingController";
import { BackendClient } from "../backend/BackendClient";
import { Scorm12API } from "../api/Scorm12API";

export class PlayerContext {
  public cmi: CmiModel;
  public stateMachine: PlayerStateMachine;
  public timing: TimingController;
  public backend: BackendClient;
  public api: Scorm12API;

  constructor(cmiData: Record<string, string>, cmiBaseUrl: string, updateProgress: () => void) {
    this.cmi = new CmiModel(cmiData);
    this.stateMachine = new PlayerStateMachine();
    this.timing = new TimingController(this.cmi);
    this.backend = new BackendClient(cmiBaseUrl, updateProgress);

    // Set API for SCO to use
    this.api = new Scorm12API(this.cmi, this.stateMachine, this.timing, this.backend);
    this.stateMachine.setReady();
    // Expose globally for SCO iframe
    (window as any).API = this.api;
  }
}
