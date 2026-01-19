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

  async commitCMI(cmi: Record<string, string>) { 
    await fetch(this.lmsCommitUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ elements: {...cmi}})
    });
    this.updateProgress();
  }

  async finishCMI(cmi: Record<string, string>) { 
    await fetch(this.lmsFinish, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ elements: {...cmi}})
    });
    this.updateProgress();
  }

  async saveCMI(cmi: Record<string, string>) {
    await fetch(this.cmiDataUrl, {
      method: "patch",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ elements: {...cmi}})
    });
    this.updateProgress();
  }
}
