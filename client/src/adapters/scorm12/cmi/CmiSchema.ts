export interface CmiElementSchema {
  readOnly?: boolean;
  maxLength?: number;
  enum?: string[];
  min?: number;
  max?: number;
}

export const CMI_SCHEMA: Record<string, CmiElementSchema> = {
  "cmi.core.lesson_status": {
    enum: [
      "passed",
      "completed",
      "failed",
      "incomplete",
      "browsed",
      "not attempted"
    ]
  },
  "cmi.core.score.raw": {
    min: 0,
    max: 100
  },
  "cmi.suspend_data": {
    maxLength: 4096
  },
  "cmi.core.entry": {
    readOnly: true
  },
  "cmi.core.total_time": {
    readOnly: true
  }
};
