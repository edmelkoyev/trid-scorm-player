import { CmiValidator } from "./CmiValidator";
import { CMI_CHILDREN_MAP } from "./CmiChildrenMap";
import { ScormErrorCodeType, ScormErrorCode } from "../api/ScormErrorCodes";

const cmiExcludeKeys = new Set([
    'cmi._version',
    'cmi.core.credit',
    'cmi.core.entry',
    'cmi.core.lesson_mode',
    'cmi.core.student_id',
    'cmi.core.student_name',
    'cmi.core.total_time',
    'cmi.launch_data'
]);

export class CmiModel {
  private data: Record<string, string>;

  constructor(initial: Record<string, string>) {
    this.data = { ...initial };
  }

  getChildren(parent: string): string {
    const children = CMI_CHILDREN_MAP[parent];

    if (!children) {
      return "";
    }

    return children.join(",");
  }

  getValue(key: string): string | undefined {
    return this.data[key];
  }

  setValue(key: string, value: string): boolean | ScormErrorCodeType {
    const validateResult = CmiValidator.validateSet(key, value);
    if (typeof validateResult === 'boolean') {
      if (!validateResult) {
        return false;
      }
    }
    if (validateResult as ScormErrorCodeType in ScormErrorCode) {
      return validateResult;
    }

    this.data[key] = value;
    return true;
  }

  setSystemValue(key: string, value: string): boolean {
    this.data[key] = value;
    return true;
  }

  snapshot(): Record<string, string> {
    const dataToSend = Object.fromEntries(
      Object.entries(this.data).filter(([key]) => !cmiExcludeKeys.has(key))
    );
    return dataToSend;
  }


}
