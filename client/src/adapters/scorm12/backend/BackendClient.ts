export class BackendClient {
  private cmiDataUrl: string;
  private lmsCommitUrl: string;
  private lmsFinish: string;

  constructor(cmiBaseUrl: string) {
    this.cmiDataUrl = `${cmiBaseUrl}/data-elements`
    this.lmsCommitUrl = `${cmiBaseUrl}/LMSCommit`;
    this.lmsFinish = `${cmiBaseUrl}/LMSFinish`;
  }

  async commitCMI(cmi: Record<string, string>) {
    const url = `` 
    await fetch(this.lmsCommitUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ elements: {...cmi}})
    });
  }

  async finishCMI(cmi: Record<string, string>) {
    const url = `` 
    await fetch(this.lmsFinish, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ elements: {...cmi}})
    });
  }

  async saveCMI(cmi: Record<string, string>) {
    await fetch(this.cmiDataUrl, {
      method: "patch",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ elements: {...cmi}})
    });
  }
}
