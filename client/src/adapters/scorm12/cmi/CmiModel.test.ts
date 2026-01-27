import { CmiModel } from './CmiModel';
import { CmiValidator } from './CmiValidator';
import { CMI_CHILDREN_MAP } from './CmiChildrenMap';
import { ScormErrorCode, ScormErrorCodeType } from '../api/ScormErrorCodes';

// Mock dependencies
jest.mock('./CmiValidator');
jest.mock('./CmiChildrenMap');
jest.mock('../api/ScormErrorCodes');

// Cast mocks to correct types
const MockCmiValidator = CmiValidator as jest.Mocked<typeof CmiValidator>;
const MockCmiChildrenMap = CMI_CHILDREN_MAP as Record<string, string[]>;

describe('CmiModel', () => {
  const initialData = {
    'cmi.core.lesson_status': 'not attempted',
    'cmi.core.score.raw': '85',
    'cmi._version': '1.2',
    'cmi.launch_data': 'some launch data',
  };

  let cmiModel: CmiModel;

  beforeEach(() => {
    cmiModel = new CmiModel(initialData);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with a copy of the provided data', () => {
      expect(cmiModel).toBeDefined();
      const snap = cmiModel.snapshot();
      expect(snap['cmi.core.lesson_status']).toBe('not attempted');
    });
  });

  describe('getChildren', () => {
    it('should return comma-separated children when parent exists', () => {
      MockCmiChildrenMap['cmi.core'] = ['lesson_status', 'score', 'exit'];
      const result = cmiModel.getChildren('cmi.core');
      expect(result).toBe('lesson_status,score,exit');
    });

    it('should return empty string when parent has no children', () => {
      MockCmiChildrenMap['cmi.core'] = ['lesson_status', 'score', 'exit'];
      const result = cmiModel.getChildren('cmi.launch_data');
      expect(result).toBe('');
    });
  });

  describe('getValue', () => {
    it('should return value when validation passes', () => {
      MockCmiValidator.validateGet.mockReturnValue(ScormErrorCode.NoError);
      const result = cmiModel.getValue('cmi.core.lesson_status');
      expect(result).toBe('not attempted');
    });

    it('should return error code when validation fails', () => {
      const errorCode = ScormErrorCode.GeneralException;
      MockCmiValidator.validateGet.mockReturnValue(errorCode);
      const result = cmiModel.getValue('cmi.invalid_key');
      expect(result).toBe(errorCode);
    });
  });

  describe('setValue', () => {
    it('should set value and return true when validation passes', () => {
      MockCmiValidator.validateSet.mockReturnValue(true);
      const result = cmiModel.setValue('cmi.core.lesson_status', 'completed');
      expect(result).toBe(true);
      expect(MockCmiValidator.validateSet).toHaveBeenCalledWith('cmi.core.lesson_status', 'completed');
      expect(cmiModel.snapshot()['cmi.core.lesson_status']).toBe('completed');
    });

    it('should be possible to set value as number', () => {
      MockCmiValidator.validateSet.mockReturnValue(true);
      const result = cmiModel.setValue('cmi.core.score.raw', 10);
      expect(result).toEqual(true);
      expect(MockCmiValidator.validateSet).toHaveBeenCalledWith('cmi.core.score.raw', '10');
      expect(cmiModel.snapshot()['cmi.core.score.raw']).toBe('10');
    });

    it('should return false when validator returns false', () => {
      MockCmiValidator.validateSet.mockReturnValue(false);
      const result = cmiModel.setValue('cmi.core.lesson_status', 'invalid_value');
      expect(result).toBe(false);
    });

    it('should return error code when validator returns an error code', () => {
      const errorCode = ScormErrorCode.NotInitialized;
      MockCmiValidator.validateSet.mockReturnValue(errorCode);
      const result = cmiModel.setValue('cmi.some.key', 'value');
      expect(result).toBe(errorCode);
    });
  });

  describe('snapshot', () => {
    it('should exclude predefined keys', () => {
      const snap = cmiModel.snapshot();
      expect(snap['cmi._version']).toBeUndefined();
      expect(snap['cmi.launch_data']).toBeUndefined();
      expect(snap['cmi.core.lesson_status']).toBe('not attempted');
      expect(snap['cmi.core.score.raw']).toBe('85');
    });

    it('should include non-excluded keys', () => {
      MockCmiValidator.validateSet.mockReturnValue(true);
      cmiModel.setValue('cmi.suspend_data', 'sco suspend data abc123');
      const snap = cmiModel.snapshot();
      expect(snap['cmi.suspend_data']).toBe('sco suspend data abc123');
    });
  });

  describe('updateCmi', () => {
    it('should merge response JSON into data', async () => {
      cmiModel.updateCmi({
        'cmi.core.lesson_status': 'passed',
        'cmi.core.score.raw': '90',
      });

      const snap = cmiModel.snapshot();
      expect(snap['cmi.core.lesson_status']).toBe('passed');
      expect(snap['cmi.core.score.raw']).toBe('90');
    });

    it('should not remove existing keys not in response', async () => {
      cmiModel.updateCmi({
        'cmi.core.lesson_status': 'failed',
      });

      const snap = cmiModel.snapshot();
      expect(snap['cmi.core.lesson_status']).toBe('failed');
      expect(snap['cmi.core.score.raw']).toBe('85');
    });
  });
});