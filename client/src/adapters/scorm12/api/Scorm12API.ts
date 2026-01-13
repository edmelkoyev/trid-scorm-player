import { IScormAPI } from "./ScormApiTypes";
import { ScormErrorCode, ScormErrorStrings } from "./ScormErrorCodes";
import { CmiModel } from "../cmi/CmiModel";
import { PlayerStateMachine } from "../state/PlayerStateMachine";
import { TimingController } from "../timing/TimingController";
import { BackendClient } from "../backend/BackendClient";

export class Scorm12API implements IScormAPI {
  private lastError = ScormErrorCode.NoError;

  constructor(
    private cmi: CmiModel,
    private stateMachine: PlayerStateMachine,
    private timing: TimingController,
    private backend: BackendClient
  ) {}

  LMSInitialize(_: string): string {
    if (!this.stateMachine.canInitialize()) {
      this.lastError = ScormErrorCode.InvalidArgument;
      return "false";
    }

    this.stateMachine.initialize();
    this.timing.startSession();
    this.lastError = ScormErrorCode.NoError;
    return "true";
  }

  LMSGetValue(element: string): string {
    if (!this.stateMachine.isInitialized()) {
      this.lastError = ScormErrorCode.NotInitialized;
      return "";
    }

    if (element.endsWith("._children")) {
      const parent = element.replace("._children", "");
      const children = this.cmi.getChildren(parent)
      if (children === "") {
        this.lastError = ScormErrorCode.NotImplementedError
      }
      return children;
    }

    const value = this.cmi.getValue(element);
    this.lastError = ScormErrorCode.NoError;
    return value ?? "";
  }

  LMSSetValue(element: string, value: string): string {
    if (!this.stateMachine.isInitialized()) {
      this.lastError = ScormErrorCode.NotInitialized;
      return "false";
    }

    const success = this.cmi.setValue(element, value);
    this.lastError = success
      ? ScormErrorCode.NoError
      : ScormErrorCode.InvalidArgument;

    return success ? "true" : "false";
  }

  LMSCommit(_: string): string {
    if (!this.stateMachine.isInitialized()) {
      this.lastError = ScormErrorCode.NotInitialized;
      return "false";
    }

    this.timing.updateTotalTime();
    this.cmi.setSystemValue('cmi.core.entry', 'resume');
    this.backend.saveCMI(this.cmi.snapshot());
    this.lastError = ScormErrorCode.NoError;
    return "true";
  }

  LMSFinish(_: string): string {
    if (!this.stateMachine.isInitialized()) {
      this.lastError = ScormErrorCode.NotInitialized;
      return "false";
    }

    this.timing.finalizeSession();
    this.cmi.setSystemValue('cmi.core.entry', '');
    this.backend.saveCMI(this.cmi.snapshot());
    this.stateMachine.terminate();
    this.lastError = ScormErrorCode.NoError;
    return "true";
  }

  LMSGetLastError(): string {
    return String(this.lastError);
  }

  LMSGetErrorString(code: string): string {
    return ScormErrorStrings[Number(code)] || "Unknown error";
  }

  LMSGetDiagnostic(code: string): string {
    return `SCORM error code: ${code}`;
  }
}
