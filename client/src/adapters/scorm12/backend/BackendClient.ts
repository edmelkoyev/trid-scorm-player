import {CmiModel} from "../cmi/CmiModel";

export class BackendClient {
  private cmiDataUrl: string;
  private lmsCommitUrl: string;
  private lmsFinish: string;
  private updateProgress: () => void;

  constructor(cmiBaseUrl: string, updateProgress: () => void) {
    this.cmiDataUrl = `${cmiBaseUrl}/data-elements`
    this.lmsCommitUrl = `${cmiBaseUrl}/LMSCommit`;
    this.lmsFinish = `${cmiBaseUrl}/LMSFinish`;

    this.updateProgress = updateProgress;
  }

  async commitCMI(cmi: CmiModel) { 
    await cmi.updateCmi(await fetch(this.lmsCommitUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ elements: {...cmi.snapshot()}})
    }));
    this.updateProgress();
  }

  async finishCMI(cmi: CmiModel) { 
    await cmi.updateCmi(await fetch(this.lmsFinish, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ elements: {...cmi.snapshot()}})
    }));
    this.updateProgress();
  }

  async saveCMI(cmi: CmiModel) {
    await cmi.updateCmi(await fetch(this.cmiDataUrl, {
      method: "patch",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ elements: {...cmi.snapshot()}})
    }));
    this.updateProgress();
  }
}
