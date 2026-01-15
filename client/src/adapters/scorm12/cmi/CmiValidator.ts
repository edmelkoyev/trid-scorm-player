import { ScormErrorCodeType, ScormErrorCode } from "../api/ScormErrorCodes";
import { CMI_SCHEMA } from "./CmiSchema";

export class CmiValidator {
  static validateSet(key: string, value: string): boolean | ScormErrorCodeType {
    const schema = CMI_SCHEMA[key];
    if (!schema) return ScormErrorCode.NotImplementedError;

    if (schema.readOnly?.value) return schema.readOnly?.error || false;

    if (schema.enum?.value && !schema.enum?.value.includes(value)) {
      return schema.enum?.error || false;
    }

    if (schema.maxLength?.value && value.length > schema.maxLength?.value) {
      return schema.maxLength?.error || false;
    }

    if ((schema.minMax?.min !== undefined || schema.minMax?.max !== undefined) &&
        isNaN(Number(value))) {
      return schema.minMax?.error || false;
    }

    if (schema.minMax?.min !== undefined && Number(value) < schema.minMax?.min) return false;
    if (schema.minMax?.max !== undefined && Number(value) > schema.minMax?.max) return false;

    return true;
  }
}
