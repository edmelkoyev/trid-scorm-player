import {Scorm12API} from '../Scorm12API';
import {CmiModel} from '../../cmi/CmiModel';
import {PlayerStateMachine} from '../../state/PlayerStateMachine';
import {TimingController} from '../../timing/TimingController';
import {BackendClient} from '../../backend/BackendClient';
import {ScormErrorCode} from '../ScormErrorCodes';

// Mock all dependencies
jest.mock('../../cmi/CmiModel');
jest.mock('../../state/PlayerStateMachine');
jest.mock('../../timing/TimingController');
jest.mock('../../backend/BackendClient');

describe('Scorm12API', () => {
  let api: Scorm12API;
  let mockCmi: jest.Mocked<CmiModel>;
  let mockStateMachine: jest.Mocked<PlayerStateMachine>;
  let mockTiming: jest.Mocked<TimingController>;
  let mockBackend: jest.Mocked<BackendClient>;

  beforeEach(() => {
    // Create mocked instances
    mockCmi = new CmiModel({}) as jest.Mocked<CmiModel>;
    mockStateMachine = new PlayerStateMachine() as jest.Mocked<PlayerStateMachine>;
    mockTiming = new TimingController(mockCmi) as jest.Mocked<TimingController>;
    mockBackend = {
      commitCMI: jest.fn(),
      finishCMI: jest.fn(),
      saveCMI: jest.fn(),
    } as unknown as jest.Mocked<BackendClient>;

    // Setup default mocks
    mockStateMachine.canInitialize.mockReturnValue(true);
    mockStateMachine.isInitialized.mockReturnValue(false);
    mockCmi.getValue.mockReturnValue('');
    mockCmi.getChildren.mockReturnValue('');
    mockCmi.setValue.mockReturnValue(true);
    mockCmi.snapshot.mockReturnValue({});

    api = new Scorm12API(mockCmi, mockStateMachine, mockTiming, mockBackend);
  });

  describe('LMSInitialize', () => {
    it('should initialize successfully when state machine allows initialization', () => {
      mockStateMachine.canInitialize.mockReturnValue(true);

      const result = api.LMSInitialize('');

      expect(result).toBe('true');
      expect(mockStateMachine.initialize).toHaveBeenCalled();
      expect(mockTiming.startSession).toHaveBeenCalled();
      expect(api.LMSGetLastError()).toBe(String(ScormErrorCode.NoError));
    });

    it('should return false when state machine does not allow initialization', () => {
      mockStateMachine.canInitialize.mockReturnValue(false);

      const result = api.LMSInitialize('');

      expect(result).toBe('false');
      expect(mockStateMachine.initialize).not.toHaveBeenCalled();
      expect(mockTiming.startSession).not.toHaveBeenCalled();
      expect(api.LMSGetLastError()).toBe(String(ScormErrorCode.InvalidArgument));
    });

    it('should update internal state after successful initialization', () => {
      mockStateMachine.canInitialize.mockReturnValue(true);
      mockStateMachine.isInitialized.mockReturnValueOnce(false).mockReturnValue(true);

      const result = api.LMSInitialize('');

      expect(result).toBe('true');
    });

    it('should return false when already initialized', () => {
      mockStateMachine.canInitialize.mockReturnValue(true);
      mockStateMachine.isInitialized.mockReturnValue(true); // Уже инициализирован

      const result = api.LMSInitialize('');

      expect(result).toBe('false');
      expect(mockStateMachine.initialize).not.toHaveBeenCalled();
      expect(api.LMSGetLastError()).toBe(String(ScormErrorCode.GeneralException));
    });
  });

  describe('LMSGetValue', () => {
    it('should return empty string when not initialized', () => {
      mockStateMachine.isInitialized.mockReturnValue(false);

      const result = api.LMSGetValue('cmi.core.student_id');

      expect(result).toBe('');
      expect(api.LMSGetLastError()).toBe(String(ScormErrorCode.NotInitialized));
    });

    it('should return value from CMI model when initialized', () => {
      mockStateMachine.isInitialized.mockReturnValue(true);
      mockCmi.getValue.mockReturnValue('student123');

      const result = api.LMSGetValue('cmi.core.student_id');

      expect(result).toBe('student123');
      expect(mockCmi.getValue).toHaveBeenCalledWith('cmi.core.student_id');
      expect(api.LMSGetLastError()).toBe(String(ScormErrorCode.NoError));
    });

    it('should return empty string when CMI model returns undefined', () => {
      mockStateMachine.isInitialized.mockReturnValue(true);
      mockCmi.getValue.mockReturnValue(undefined);

      const result = api.LMSGetValue('cmi.core.student_id');

      expect(result).toBe('');
      expect(mockCmi.getValue).toHaveBeenCalledWith('cmi.core.student_id');
      expect(api.LMSGetLastError()).toBe(String(ScormErrorCode.NoError));
    });

    it('should return children when element ends with _children', () => {
      mockStateMachine.isInitialized.mockReturnValue(true);
      mockCmi.getChildren.mockReturnValue('student_id,student_name');

      const result = api.LMSGetValue('cmi.core._children');

      expect(result).toBe('student_id,student_name');
      expect(mockCmi.getChildren).toHaveBeenCalledWith('cmi.core');
      expect(api.LMSGetLastError()).toBe(String(ScormErrorCode.NoError));
    });

    it('should return empty string when element ends with _children but no children found', () => {
      mockStateMachine.isInitialized.mockReturnValue(true);
      mockCmi.getChildren.mockReturnValue('');

      const result = api.LMSGetValue('cmi.core._children');

      expect(result).toBe('');
      expect(mockCmi.getChildren).toHaveBeenCalledWith('cmi.core');
      expect(api.LMSGetLastError()).toBe(String(ScormErrorCode.NotImplementedError));
    });

    it('should return empty string and set error code when CMI model returns an error', () => {
      mockStateMachine.isInitialized.mockReturnValue(true);
      mockCmi.getValue.mockReturnValue(ScormErrorCode.WriteOnly);
      const result = api.LMSGetValue('cmi.core.exit');

      expect(result).toBe('');
      expect(mockCmi.getValue).toHaveBeenCalledWith('cmi.core.exit');
      expect(api.LMSGetLastError()).toBe(String(ScormErrorCode.WriteOnly));
    });
  });

  describe('LMSSetValue', () => {
    it('should return false when not initialized', () => {
      mockStateMachine.isInitialized.mockReturnValue(false);

      const result = api.LMSSetValue('cmi.core.lesson_status', 'passed');

      expect(result).toBe('false');
      expect(mockCmi.setValue).not.toHaveBeenCalled();
      expect(api.LMSGetLastError()).toBe(String(ScormErrorCode.NotInitialized));
    });

    it('should return true when value is successfully set', () => {
      mockStateMachine.isInitialized.mockReturnValue(true);
      mockCmi.setValue.mockReturnValue(true);

      const result = api.LMSSetValue('cmi.core.lesson_status', 'passed');

      expect(result).toBe('true');
      expect(mockCmi.setValue).toHaveBeenCalledWith('cmi.core.lesson_status', 'passed');
      expect(api.LMSGetLastError()).toBe(String(ScormErrorCode.NoError));
    });

    it('should return false when value fails to set', () => {
      mockStateMachine.isInitialized.mockReturnValue(true);
      mockCmi.setValue.mockReturnValue(false);

      const result = api.LMSSetValue('cmi.core.lesson_status', 'passed');

      expect(result).toBe('false');
      expect(mockCmi.setValue).toHaveBeenCalledWith('cmi.core.lesson_status', 'passed');
      expect(api.LMSGetLastError()).toBe(String(ScormErrorCode.InvalidArgument));
    });

    it('should return false when setValue returns error code', () => {
      mockStateMachine.isInitialized.mockReturnValue(true);
      mockCmi.setValue.mockReturnValue(ScormErrorCode.InvalidSetValue);

      const result = api.LMSSetValue('cmi.core.lesson_status', 'passed');

      expect(result).toBe('false');
      expect(mockCmi.setValue).toHaveBeenCalledWith('cmi.core.lesson_status', 'passed');
      expect(api.LMSGetLastError()).toBe(String(ScormErrorCode.InvalidSetValue));
    });

    it('should return false for unknown error codes', () => {
      mockStateMachine.isInitialized.mockReturnValue(true);
      mockCmi.setValue.mockReturnValue(999 as any);

      const result = api.LMSSetValue('cmi.core.lesson_status', 'passed');

      expect(result).toBe('false');
      expect(mockCmi.setValue).toHaveBeenCalledWith('cmi.core.lesson_status', 'passed');
      expect(api.LMSGetLastError()).toBe(String(ScormErrorCode.NoError)); // Last error remains unchanged
    });
  });

  describe('LMSCommit', () => {
    it('should commit successfully when initialized', () => {
      mockStateMachine.isInitialized.mockReturnValue(true);

      const result = api.LMSCommit('');

      expect(result).toBe('true');
      expect(mockBackend.commitCMI).toHaveBeenCalled();
      expect(api.LMSGetLastError()).toBe(String(ScormErrorCode.NoError));
    });

    it('should return false when not initialized', () => {
      mockStateMachine.isInitialized.mockReturnValue(false);

      const result = api.LMSCommit('');

      expect(result).toBe('false');
      expect(mockCmi.setSystemValue).not.toHaveBeenCalled();
      expect(mockBackend.commitCMI).not.toHaveBeenCalled();
      expect(api.LMSGetLastError()).toBe(String(ScormErrorCode.NotInitialized));
    });
  });

  describe('LMSFinish', () => {
    it('should finish successfully when initialized', () => {
      mockStateMachine.isInitialized.mockReturnValue(true);

      const result = api.LMSFinish('');

      expect(result).toBe('true');
      expect(mockTiming.finalizeSession).toHaveBeenCalled();
      expect(mockBackend.finishCMI).toHaveBeenCalled();
      expect(mockStateMachine.terminate).toHaveBeenCalled();
      expect(api.LMSGetLastError()).toBe(String(ScormErrorCode.NoError));
    });

    it('should return false when not initialized', () => {
      mockStateMachine.isInitialized.mockReturnValue(false);

      const result = api.LMSFinish('');

      expect(result).toBe('false');
      expect(mockTiming.finalizeSession).not.toHaveBeenCalled();
      expect(mockCmi.setSystemValue).not.toHaveBeenCalled();
      expect(mockBackend.finishCMI).not.toHaveBeenCalled();
      expect(mockStateMachine.terminate).not.toHaveBeenCalled();
      expect(api.LMSGetLastError()).toBe(String(ScormErrorCode.NotInitialized));
    });
  });

  describe('LMSGetLastError', () => {
    it('should return the last error code', () => {
      // Initially should be NoError
      expect(api.LMSGetLastError()).toBe(String(ScormErrorCode.NoError));

      // Set an error by calling an operation that fails
      mockStateMachine.isInitialized.mockReturnValue(false);
      api.LMSGetValue('cmi.core.student_id');

      expect(api.LMSGetLastError()).toBe(String(ScormErrorCode.NotInitialized));
    });
  });

  describe('LMSGetErrorString', () => {
    it('should return error string for known error code', () => {
      const result = api.LMSGetErrorString(String(ScormErrorCode.GeneralException));

      expect(result).toContain('General Exception');
    });

    it('should return "Unknown error" for unknown error code', () => {
      const result = api.LMSGetErrorString('999');

      expect(result).toBe('Unknown error');
    });
  });

  describe('LMSGetDiagnostic', () => {
    it('should return diagnostic string with error code', () => {
      const result = api.LMSGetDiagnostic('101');

      expect(result).toBe('SCORM error code: 101');
    });

    it('should handle different error codes correctly', () => {
      const result = api.LMSGetDiagnostic('205');

      expect(result).toBe('SCORM error code: 205');
    });
  });
});
