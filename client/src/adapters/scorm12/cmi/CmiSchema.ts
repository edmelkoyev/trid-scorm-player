import { ScormErrorCodeType, ScormErrorCode } from "../api/ScormErrorCodes";


export interface CmiElementSchema {
  readOnly?: {
    value: boolean;
    error?: ScormErrorCodeType;
  };
  maxLength?: {
    value: number;
    error?: ScormErrorCodeType;
  };
  enum?: {
   value: string[];
   error: ScormErrorCodeType;
  };
  minMax?: {
    min?: number;
    max?: number;
    error?: ScormErrorCodeType;
  };
}

export const CMI_SCHEMA: Record<string, CmiElementSchema> = {
  "cmi.core.lesson_status": {
    enum: {
      value: [
        "passed",
        "completed",
        "failed",
        "incomplete",
        "browsed",
        "not attempted"
      ],
      error: ScormErrorCode.ElementNotAnArray
    }
  },
  "cmi.core.score.raw": {
    minMax: {
      min: 0,
      max: 100,
      error: ScormErrorCode.IncorrectDataType
    }
  },
  "cmi.suspend_data": {
    maxLength: {
      value: 4096,
      error: ScormErrorCode.IncorrectDataType
    },
  },
  "cmi.core.entry": {
    readOnly: {
      value: true,
      error: ScormErrorCode.ReadOnly
    }
  },
  "cmi.core.total_time": {
    readOnly: {
      value: true,
      error: ScormErrorCode.ReadOnly
    }
  },
  "cmi.lesson_location": {
    maxLength: {
      value: 255,
      error: ScormErrorCode.IncorrectDataType
    },
  },
};
