import { ScormErrorCodeType, ScormErrorCode } from "../api/ScormErrorCodes";
import { CMI_SCHEMA } from "./CmiSchema";

export class CmiValidator {
  static validateSet(key: string, value: string): boolean | ScormErrorCodeType {
    if (typeof value == "undefined"
      || value == null
      || typeof value !== "string") {
        return ScormErrorCode.IncorrectDataType;
    }

    const schema = CMI_SCHEMA[key];
    if (!schema) return ScormErrorCode.NotImplementedError;

    if (schema.readOnly?.value) return schema.readOnly?.error || ScormErrorCode.ReadOnly;

    if (schema.enum?.value && !schema.enum?.value.includes(value)) {
      return schema.enum?.error || ScormErrorCode.ElementNotAnArray;
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

  static validateGet(key: string): ScormErrorCodeType {
    const schema = CMI_SCHEMA[key];
    if (!schema) return ScormErrorCode.NotImplementedError;

    if (schema.writeOnly?.value) return schema.writeOnly?.error || ScormErrorCode.WriteOnly;

    return ScormErrorCode.NoError;
  }
}
