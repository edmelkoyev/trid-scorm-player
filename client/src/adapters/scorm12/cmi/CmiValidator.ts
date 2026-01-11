import { CMI_SCHEMA } from "./CmiSchema";

export class CmiValidator {
  static validateSet(key: string, value: string): boolean {
    const schema = CMI_SCHEMA[key];
    if (!schema) return true;

    if (schema.readOnly) return false;

    if (schema.enum && !schema.enum.includes(value)) {
      return false;
    }

    if (schema.maxLength && value.length > schema.maxLength) {
      return false;
    }

    if ((schema.min !== undefined || schema.max !== undefined) &&
        isNaN(Number(value))) {
      return false;
    }

    if (schema.min !== undefined && Number(value) < schema.min) return false;
    if (schema.max !== undefined && Number(value) > schema.max) return false;

    return true;
  }
}
