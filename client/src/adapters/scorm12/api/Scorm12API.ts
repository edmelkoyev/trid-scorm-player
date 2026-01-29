import { IScormAPI } from './ScormApiTypes';
import {
  ScormErrorCode,
  ScormErrorCodeType,
  ScormErrorStrings,
} from './ScormErrorCodes';
import { CmiModel } from '../cmi/CmiModel';
import { PlayerStateMachine } from '../state/PlayerStateMachine';
import { TimingController } from '../timing/TimingController';
import { BackendClient } from '../backend/BackendClient';


export class Scorm12API implements IScormAPI {
  private lastError = ScormErrorCode.NoError;

  private cmi: CmiModel;

  private stateMachine: PlayerStateMachine;

  private timing: TimingController;

  private backend: BackendClient;

  constructor(
    cmi: CmiModel,
    stateMachine: PlayerStateMachine,
    timing: TimingController,
    backend: BackendClient,
  ) {
    this.cmi = cmi;
    this.stateMachine = stateMachine;
    this.timing = timing;
    this.backend = backend;
  }

  LMSInitialize(param?: string): string {
    if (param === undefined || param !== '') {
      this.lastError = ScormErrorCode.InvalidArgument;
      return 'false';
    }
    if (!this.stateMachine.canInitialize()) {
      this.lastError = ScormErrorCode.InvalidArgument;
      return 'false';
    }
    if (this.stateMachine.isInitialized()) {
      this.lastError = ScormErrorCode.GeneralException;
      return 'false';
    }

    this.stateMachine.initialize();
    this.timing.startSession();
    this.lastError = ScormErrorCode.NoError;
    return 'true';
  }

  LMSGetValue(element: string): string {
    if (!this.stateMachine.isInitialized()) {
      this.lastError = ScormErrorCode.NotInitialized;
      return '';
    }

    if (element.endsWith('._children')) {
      const parent = element.replace('._children', '');
      const children = this.cmi.getChildren(parent);
      if (children === '') {
        this.lastError = ScormErrorCode.NotImplementedError;
      }
      return children;
    }

    const getValueResult = this.cmi.getValue(element);

    if (typeof getValueResult !== 'string' && getValueResult !== undefined) {
      this.lastError = getValueResult as ScormErrorCodeType;
      return '';
    }

    this.lastError = ScormErrorCode.NoError;
    return getValueResult || '';
  }

  LMSSetValue(element: string, value: string): string {
    if (!this.stateMachine.isInitialized()) {
      this.lastError = ScormErrorCode.NotInitialized;
      return 'false';
    }

    const setValueResult = this.cmi.setValue(element, value);
    if (typeof setValueResult === 'boolean') {
      this.lastError = setValueResult
        ? ScormErrorCode.NoError
        : ScormErrorCode.InvalidArgument;
      return setValueResult ? 'true' : 'false';
    }

    if (Object.values(ScormErrorCode).includes(setValueResult as ScormErrorCodeType)) {
      this.lastError = setValueResult;
      return 'false';
    }

    return 'false';
  }

  LMSCommit(param?: string): string {
    if (param === undefined || param !== '') {
      this.lastError = ScormErrorCode.InvalidArgument;
      return 'false';
    }
    if (!this.stateMachine.isInitialized()) {
      this.lastError = ScormErrorCode.NotInitialized;
      return 'false';
    }

    (async () => {
      try {
        const success = await this.backend.commitCMI(this.cmi);
        if (!success) {
          window.console.error('LMSCommit backend commit failed');
          this.lastError = ScormErrorCode.GeneralException;
        }
      } catch (err) {
        window.console.error('LMSCommit backend error', err);
        this.lastError = ScormErrorCode.GeneralException;
      }
    })();
    this.lastError = ScormErrorCode.NoError;
    return 'true';
  }

  LMSFinish(param?: string): string {
    if (param === undefined || param !== '') {
      this.lastError = ScormErrorCode.InvalidArgument;
      return 'false';
    }
    if (!this.stateMachine.isInitialized()) {
      this.lastError = ScormErrorCode.NotInitialized;
      return 'false';
    }

    this.timing.finalizeSession();
    (async () => {
      try {
        const success = await this.backend.finishCMI(this.cmi);
        if (!success) {
          window.console.error('LMSFinish backend commit failed');
          this.lastError = ScormErrorCode.GeneralException;
        }
      } catch (err) {
        window.console.error('LMSFinish backend error', err);
        this.lastError = ScormErrorCode.GeneralException;
      }
    })();
    this.stateMachine.terminate();
    this.lastError = ScormErrorCode.NoError;
    return 'true';
  }

  LMSGetLastError(): string {
    return String(this.lastError);
  }

  // eslint-disable-next-line class-methods-use-this
  LMSGetErrorString(code: string): string {
    return ScormErrorStrings[Number(code)] || 'Unknown error';
  }

  // eslint-disable-next-line class-methods-use-this
  LMSGetDiagnostic(code: string): string {
    return `SCORM error code: ${code}`;
  }
}
