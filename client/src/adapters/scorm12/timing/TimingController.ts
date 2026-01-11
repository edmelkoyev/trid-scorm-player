import { parseScormTime, formatScormTime } from "./ScormTime";
import { CmiModel } from "../cmi/CmiModel";

export class TimingController {
  private sessionStart = 0;
  private accumulatedMs = 0;

  constructor(private cmi: CmiModel) {
    const total = cmi.getValue("cmi.core.total_time");
    this.accumulatedMs = parseScormTime(total);
  }

  startSession() {
    this.sessionStart = Date.now();
  }

  updateTotalTime() {
    const sessionMs = Date.now() - this.sessionStart;
    this.cmi.setValue(
      "cmi.core.total_time",
      formatScormTime(this.accumulatedMs + sessionMs)
    );
  }

  finalizeSession() {
    const sessionMs = Date.now() - this.sessionStart;
    this.accumulatedMs += sessionMs;

    this.cmi.setValue("cmi.core.session_time", formatScormTime(sessionMs));
    this.cmi.setValue(
      "cmi.core.total_time",
      formatScormTime(this.accumulatedMs)
    );
  }
}
