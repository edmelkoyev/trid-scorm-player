import { CmiModel } from '../cmi/CmiModel';


export class BackendClient {
  private cmiDataUrl: string;

  private lmsCommitUrl: string;

  private lmsFinish: string;

  private updateProgress: () => void;

  constructor(cmiBaseUrl: string, updateProgress: () => void) {
    this.cmiDataUrl = `${cmiBaseUrl}/data-elements`;
    this.lmsCommitUrl = `${cmiBaseUrl}/LMSCommit`;
    this.lmsFinish = `${cmiBaseUrl}/LMSFinish`;
    this.updateProgress = updateProgress;
  }

  async commitCMI(cmi: CmiModel): Promise<boolean> {
    try {
      const res = await fetch(this.lmsCommitUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ elements: cmi.snapshot() }),
      });

      if (!res.ok) return false;

      const respStr = await res.text();
      if (typeof respStr !== 'string' || respStr.trim() !== 'true') {
        return false;
      }

      this.updateProgress();

      return true;
    } catch {
      return false;
    }
  }

  async finishCMI(cmi: CmiModel): Promise<boolean> {
    try {
      const res = await fetch(this.lmsFinish, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ elements: cmi.snapshot() }),
      });

      if (!res.ok) return false;

      const respStr = await res.text();
      if (typeof respStr !== 'string' || respStr.trim() !== 'true') {
        return false;
      }

      this.updateProgress();

      return true;
    } catch {
      return false;
    }
  }

  async saveCMI(cmi: CmiModel): Promise<boolean> {
    try {
      const res = await fetch(this.cmiDataUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ elements: { ...cmi.snapshot() } }),
      });

      if (!res.ok) return false;

      const { elements } = await res.json();
      if (!elements) return false;

      cmi.updateCmi(elements);
      this.updateProgress();

      return true;
    } catch {
      return false;
    }
  }
}
