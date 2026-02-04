import { TimingController } from './TimingController';
import { formatScormTime } from './ScormTime';
import { CmiModel } from '../cmi/CmiModel';


jest.mock('../cmi/CmiModel');
jest.mock('./ScormTime');

describe('TimingController', () => {
  let timingController: TimingController;
  let mockCmi: jest.Mocked<CmiModel>;

  beforeEach(() => {
    mockCmi = new CmiModel({ 'cmi.core.student_id': 'st123' }) as jest.Mocked<CmiModel>;
    timingController = new TimingController(mockCmi);

    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with the provided CmiModel', () => {
      expect(timingController).toBeDefined();
    });
  });

  describe('startSession', () => {
    it('should set sessionStart to current timestamp', () => {
      const mockDateNow = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(mockDateNow);

      timingController.startSession();
      expect(Date.now).toHaveBeenCalled();
    });
  });

  describe('finalizeSession', () => {
    it('should set session_time when it\'s undefined', () => {
      // Arrange
      const startTime = 1000000;
      const endTime = 1005000;
      const sessionDurationMs = endTime - startTime;

      jest.spyOn(Date, 'now')
        .mockReturnValueOnce(startTime)
        .mockReturnValue(endTime);

      mockCmi.hasValue.mockReturnValue(false);
      (formatScormTime as jest.Mock).mockReturnValue('FORMATTED_5_SEC');

      // Act
      timingController.startSession();
      timingController.finalizeSession();

      // Assert
      expect(mockCmi.hasValue).toHaveBeenCalledWith('cmi.core.session_time');
      expect(formatScormTime).toHaveBeenCalledWith(sessionDurationMs);
      expect(mockCmi.setValue).toHaveBeenCalledWith('cmi.core.session_time', 'FORMATTED_5_SEC');
    });

    it('should not set session_time when it already has a value', () => {
      // Arrange
      const startTime = 1000000;
      const endTime = 1005000;

      jest.spyOn(Date, 'now')
        .mockReturnValueOnce(startTime)
        .mockReturnValue(endTime);

      mockCmi.hasValue.mockReturnValue(true);

      // Act
      timingController.startSession();
      timingController.finalizeSession();

      // Assert
      expect(mockCmi.hasValue).toHaveBeenCalledWith('cmi.core.session_time');
      expect(formatScormTime).not.toHaveBeenCalled();
      expect(mockCmi.setValue).not.toHaveBeenCalled();
    });

    it('should handle zero duration correctly', () => {
      // Arrange
      const mockTime = 1000000;
      jest.spyOn(Date, 'now').mockReturnValue(mockTime);

      mockCmi.hasValue.mockReturnValue(false);
      (formatScormTime as jest.Mock).mockReturnValue('FORMATTED_0_SEC');

      // Act
      timingController.startSession();
      timingController.finalizeSession();

      // Assert
      expect(mockCmi.hasValue).toHaveBeenCalledWith('cmi.core.session_time');
      expect(formatScormTime).toHaveBeenCalledWith(0);
      expect(mockCmi.setValue).toHaveBeenCalledWith('cmi.core.session_time', 'FORMATTED_0_SEC');
    });

    it('should handle negative duration gracefully (edge case)', () => {
      // Arrange
      const startTime = 1005000;
      const endTime = 1000000; // end time before start time

      jest.spyOn(Date, 'now')
        .mockReturnValueOnce(startTime)
        .mockReturnValue(endTime);

      mockCmi.getValue.mockReturnValue(undefined);

      // Act
      timingController.startSession();
      timingController.finalizeSession();

      // Assert
      expect(formatScormTime).not.toHaveBeenCalled();
      expect(mockCmi.setValue).not.toHaveBeenCalled();
    });
  });
});
