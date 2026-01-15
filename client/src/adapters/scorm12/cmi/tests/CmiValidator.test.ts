import { ScormErrorCode } from "../../api/ScormErrorCodes";
import { CmiValidator } from "../CmiValidator";

describe('CmiValidator', () => {
  it('should return not supported error', () => {
    expect(CmiValidator.validateSet('not_supported_test', '')).toBe(ScormErrorCode.NotImplementedError)
  });

  it('should return ReadOnly error for read-only elements', () => {
    const key = 'cmi.core.entry';
    expect(CmiValidator.validateSet(key, 'some_value')).toBe(ScormErrorCode.ReadOnly);
  });

  it('should validate enum values correctly', () => {
    const key = 'cmi.core.lesson_status';

    expect(CmiValidator.validateSet(key, 'passed')).toBe(true);
    expect(CmiValidator.validateSet(key, 'invalid_status')).toBe(ScormErrorCode.ElementNotAnArray);
  });

  it('should validate maxLength correctly', () => {
    const key = 'cmi.suspend_data';

    expect(CmiValidator.validateSet(key, 'a'.repeat(4096))).toBe(true);
    expect(CmiValidator.validateSet(key, 'a'.repeat(4097))).toBe(ScormErrorCode.IncorrectDataType);
  });

  it('should validate minMax correctly', () => {
    const key = 'cmi.core.score.raw';

    expect(CmiValidator.validateSet(key, '50')).toBe(true);
    expect(CmiValidator.validateSet(key, 'not_a_number')).toBe(ScormErrorCode.IncorrectDataType);
    expect(CmiValidator.validateSet(key, '-10')).toBe(false);
    expect(CmiValidator.validateSet(key, '150')).toBe(false);
  });

  it('should return true for valid inputs', () => {
    const key = 'cmi.lesson_location';
    expect(CmiValidator.validateSet(key, 'valid_location')).toBe(true);
  });
});
