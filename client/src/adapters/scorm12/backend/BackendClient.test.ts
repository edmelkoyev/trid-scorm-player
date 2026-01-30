import { BackendClient } from './BackendClient';
import { CmiModel } from '../cmi/CmiModel';


const mockCmiSnapshot = { key1: 'value1', key2: 'value2' };
const mockUpdatedElements = { updated: 'true', test: 'true' };

class MockCmiModel {
  snapshot = jest.fn(() => mockCmiSnapshot);

  updateCmi = jest.fn();
}

describe('BackendClient', () => {
  let backendClient: BackendClient;
  let mockUpdateProgress: jest.Mock;

  beforeEach(() => {
    mockUpdateProgress = jest.fn();
    backendClient = new BackendClient('http://test-url.com/ctx001', mockUpdateProgress);
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const setupFetchResponseWithText = (ok?:boolean, responseText?: string) => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok,
      text: jest.fn().mockResolvedValue(responseText),
    });
  };

  const setupFetchResponseWithJson = (ok?:boolean, elements?: Record<string, string>) => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok,
      json: jest.fn().mockResolvedValue({ elements }),
    });
  };

  describe('commitCMI', () => {
    it('should commit CMI successfully', async () => {
      setupFetchResponseWithText(true, 'true');

      const mockCmi = new MockCmiModel();
      const result = await backendClient.commitCMI(mockCmi as unknown as CmiModel);

      expect(mockCmi.snapshot).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith(
        'http://test-url.com/ctx001/LMSCommit',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ elements: mockCmiSnapshot }),
        },
      );
      expect(mockCmi.updateCmi).not.toHaveBeenCalled();
      expect(mockUpdateProgress).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if response not ok', async () => {
      setupFetchResponseWithText(false);

      const mockCmi = new MockCmiModel();
      const result = await backendClient.commitCMI(mockCmi as unknown as CmiModel);

      expect(mockCmi.snapshot).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith(
        'http://test-url.com/ctx001/LMSCommit',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ elements: mockCmiSnapshot }),
        },
      );
      expect(mockCmi.updateCmi).not.toHaveBeenCalled();
      expect(mockUpdateProgress).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should return false if response does not have "true" text', async () => {
      setupFetchResponseWithText(true, 'false');

      const mockCmi = new MockCmiModel();
      const result = await backendClient.commitCMI(mockCmi as unknown as CmiModel);

      expect(mockCmi.snapshot).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith(
        'http://test-url.com/ctx001/LMSCommit',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ elements: mockCmiSnapshot }),
        },
      );
      expect(mockCmi.updateCmi).not.toHaveBeenCalled();
      expect(mockUpdateProgress).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('finishCMI', () => {
    it('should finish CMI successfully', async () => {
      setupFetchResponseWithText(true, 'true');

      const mockCmi = new MockCmiModel();
      const result = await backendClient.finishCMI(mockCmi as unknown as CmiModel);

      expect(mockCmi.snapshot).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith(
        'http://test-url.com/ctx001/LMSFinish',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ elements: mockCmiSnapshot }),
        },
      );
      expect(mockCmi.updateCmi).not.toHaveBeenCalled();
      expect(mockUpdateProgress).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if response not ok', async () => {
      setupFetchResponseWithText(false);

      const mockCmi = new MockCmiModel();
      const result = await backendClient.finishCMI(mockCmi as unknown as CmiModel);

      expect(mockCmi.snapshot).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith(
        'http://test-url.com/ctx001/LMSFinish',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ elements: mockCmiSnapshot }),
        },
      );
      expect(mockCmi.updateCmi).not.toHaveBeenCalled();
      expect(mockUpdateProgress).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should return false if response does not have "true" text', async () => {
      setupFetchResponseWithText(true, 'false');

      const mockCmi = new MockCmiModel();
      const result = await backendClient.finishCMI(mockCmi as unknown as CmiModel);

      expect(mockCmi.snapshot).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith(
        'http://test-url.com/ctx001/LMSFinish',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ elements: mockCmiSnapshot }),
        },
      );
      expect(mockCmi.updateCmi).not.toHaveBeenCalled();
      expect(mockUpdateProgress).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('saveCMI', () => {
    it('should save CMI successfully', async () => {
      setupFetchResponseWithJson(true, mockUpdatedElements);

      const mockCmi = new MockCmiModel();
      const result = await backendClient.saveCMI(mockCmi as unknown as CmiModel);

      expect(result).toBe(true);
      expect(mockCmi.snapshot).toHaveBeenCalled();
      expect(mockCmi.updateCmi).toHaveBeenCalledWith(mockUpdatedElements);
      expect(mockUpdateProgress).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith(
        'http://test-url.com/ctx001/data-elements',
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ elements: mockCmiSnapshot }),
        },
      );
    });

    it('should return false if response not ok', async () => {
      setupFetchResponseWithJson(false);

      const mockCmi = new MockCmiModel();
      const result = await backendClient.saveCMI(mockCmi as unknown as CmiModel);

      expect(fetch).toHaveBeenCalledWith(
        'http://test-url.com/ctx001/data-elements',
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ elements: mockCmiSnapshot }),
        },
      );
      expect(mockCmi.updateCmi).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should return false if elements missing in response', async () => {
      setupFetchResponseWithJson(true, undefined);

      const mockCmi = new MockCmiModel();
      const result = await backendClient.saveCMI(mockCmi as unknown as CmiModel);

      expect(fetch).toHaveBeenCalledWith(
        'http://test-url.com/ctx001/data-elements',
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ elements: mockCmiSnapshot }),
        },
      );
      expect(mockCmi.updateCmi).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });
});
