import {
  ScormErrorCodeType,
  ScormErrorCode,
} from '../api/ScormErrorCodes';


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
  writeOnly?: {
    value: boolean;
    error?: ScormErrorCodeType;
  }
}

export const CMI_SCHEMA: Record<string, CmiElementSchema> = {
  'cmi._version': {
    readOnly: {
      value: true,
      error: ScormErrorCode.ReadOnly,
    },
  },
  'cmi.core._children': {
    readOnly: {
      value: true,
      error: ScormErrorCode.ReadOnly,
    },
  },
  'cmi.core.student_id': {
    readOnly: {
      value: true,
      error: ScormErrorCode.ReadOnly,
    },
  },
  'cmi.core.student_name': {
    readOnly: {
      value: true,
      error: ScormErrorCode.ReadOnly,
    },
  },
  'cmi.core.lesson_location': {
    maxLength: {
      value: 255,
      error: ScormErrorCode.IncorrectDataType,
    },
  },
  'cmi.core.credit': {
    readOnly: {
      value: true,
      error: ScormErrorCode.ReadOnly,
    },
  },
  'cmi.core.lesson_status': {
    enum: {
      value: [
        'passed',
        'completed',
        'failed',
        'incomplete',
        'browsed',
        'not attempted',
      ],
      error: ScormErrorCode.ElementNotAnArray,
    },
  },
  'cmi.core.entry': {
    readOnly: {
      value: true,
      error: ScormErrorCode.ReadOnly,
    },
  },
  'cmi.core.score._children': {
    readOnly: {
      value: true,
      error: ScormErrorCode.ReadOnly,
    },
  },
  'cmi.core.score.raw': {
    minMax: {
      min: 0,
      max: 100,
      error: ScormErrorCode.IncorrectDataType,
    },
  },
  'cmi.core.score.max': {
    minMax: {
      min: 0,
      max: 100,
      error: ScormErrorCode.IncorrectDataType,
    },
  },
  'cmi.core.score.min': {
    minMax: {
      min: 0,
      max: 100,
      error: ScormErrorCode.IncorrectDataType,
    },
  },
  'cmi.core.total_time': {
    readOnly: {
      value: true,
      error: ScormErrorCode.ReadOnly,
    },
  },
  'cmi.core.lesson_mode': {
    readOnly: {
      value: true,
      error: ScormErrorCode.ReadOnly,
    },
  },
  'cmi.core.exit': {
    writeOnly: {
      value: true,
      error: ScormErrorCode.WriteOnly,
    },
  },
  'cmi.core.session_time': {
    writeOnly: {
      value: true,
      error: ScormErrorCode.WriteOnly,
    },
  },
  'cmi.suspend_data': {
    maxLength: {
      value: 4096,
      error: ScormErrorCode.IncorrectDataType,
    },
  },
  'cmi.launch_data': {
    readOnly: {
      value: true,
      error: ScormErrorCode.ReadOnly,
    },
  },
};
