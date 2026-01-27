import {CmiModel} from "../cmi/CmiModel";

export class BackendClient {
  private cmiDataUrl: string;
  private lmsCommitUrl: string;
  private lmsFinish: string;
  private updateProgress: (finished: boolean) => void;

  constructor(cmiBaseUrl: string, updateProgress: (finished: boolean) => void) {
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
    this.updateProgress(false);
  }

  async finishCMI(cmi: CmiModel) { 
    await cmi.updateCmi(await fetch(this.lmsFinish, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ elements: {...cmi.snapshot()}})
    }));
    this.updateProgress(true);
  }

  async saveCMI(cmi: CmiModel) {
    await cmi.updateCmi(await fetch(this.cmiDataUrl, {
      method: "patch",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ elements: {...cmi.snapshot()}})
    }));
    this.updateProgress(false);
  }

  escapeCMI(cmi: CmiModel) {
    navigator.sendBeacon(
      this.lmsFinish,
      new Blob([JSON.stringify({ elements: {...cmi.snapshot()}})], { type: 'application/json' })
    );
  }
}
