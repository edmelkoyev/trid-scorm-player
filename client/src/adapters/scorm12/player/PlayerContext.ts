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

  constructor(cmiData: Record<string, string>, cmiUrl: string) {
    this.cmi = new CmiModel(cmiData);
    this.stateMachine = new PlayerStateMachine();
    this.timing = new TimingController(this.cmi);
    this.backend = new BackendClient(cmiUrl);

    // Set API for SCO to use
    this.api = new Scorm12API(this.cmi, this.stateMachine, this.timing, this.backend);
    this.stateMachine.setReady();
    // Expose globally for SCO iframe
    (window as any).API = this.api;
  }

  // Convenience: commit current CMI to backend
  async commit() {
    this.timing.updateTotalTime();
    await this.backend.saveCMI(this.cmi.snapshot());
  }

  // Convenience: finish session and save
  async finish() {
    this.timing.finalizeSession();
    await this.backend.saveCMI(this.cmi.snapshot());
    this.stateMachine.terminate();
  }
}
