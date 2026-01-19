import { formatScormTime } from "./ScormTime";
import { CmiModel } from "../cmi/CmiModel";

export class TimingController {
  private sessionStart = 0;

  constructor(private cmi: CmiModel) {
    this.cmi = cmi;
  }

  startSession() {
    this.sessionStart = Date.now();
  }

  finalizeSession() {
    const sessionMs = Date.now() - this.sessionStart;

    if (sessionMs >= 0 && this.cmi.getValue("cmi.core.session_time") === undefined ) {
      this.cmi.setValue("cmi.core.session_time", formatScormTime(sessionMs));
    }
  }
}
