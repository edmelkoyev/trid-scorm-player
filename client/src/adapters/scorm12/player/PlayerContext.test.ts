import { PlayerContext } from './PlayerContext';
import { CmiModel } from '../cmi/CmiModel';
import { PlayerStateMachine } from '../state/PlayerStateMachine';
import { TimingController } from '../timing/TimingController';
import { BackendClient } from '../backend/BackendClient';
import { Scorm12API } from '../api/Scorm12API';

// ---- Mocks ----
jest.mock('../cmi/CmiModel');
jest.mock('../state/PlayerStateMachine');
jest.mock('../timing/TimingController');
jest.mock('../backend/BackendClient');
jest.mock('../api/Scorm12API');

describe('PlayerContext', () => {
  const cmiData = { 'cmi.core.lesson_status': 'incomplete' };
  const cmiBaseUrl = 'https://example.com/cmi';
  const updateProgress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).API;
  });

  it('creates all dependencies with correct arguments', () => {
    const context = new PlayerContext(cmiData, cmiBaseUrl, updateProgress);

    expect(CmiModel).toHaveBeenCalledTimes(1);
    expect(CmiModel).toHaveBeenCalledWith(cmiData);

    expect(PlayerStateMachine).toHaveBeenCalledTimes(1);

    expect(TimingController).toHaveBeenCalledTimes(1);
    expect(TimingController).toHaveBeenCalledWith(context.cmi);

    expect(BackendClient).toHaveBeenCalledTimes(1);
    expect(BackendClient).toHaveBeenCalledWith(cmiBaseUrl, updateProgress);

    expect(Scorm12API).toHaveBeenCalledTimes(1);
    expect(Scorm12API).toHaveBeenCalledWith(
      context.cmi,
      context.stateMachine,
      context.timing,
      context.backend,
    );
  });

  it('calls stateMachine.setReady()', () => {
    const setReadyMock = jest.fn();

    (PlayerStateMachine as jest.Mock).mockImplementationOnce(() => ({
      setReady: setReadyMock,
    }));

    const context = new PlayerContext(cmiData, cmiBaseUrl, updateProgress);

    expect(context).toBeDefined();
    expect(setReadyMock).toHaveBeenCalledTimes(1);
  });

  it('exposes Scorm API on window.API', () => {
    const context = new PlayerContext(cmiData, cmiBaseUrl, updateProgress);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((window as any).API).toBe(context.api);
  });

  it('assigns public properties correctly', () => {
    const context = new PlayerContext(cmiData, cmiBaseUrl, updateProgress);

    expect(context.cmi).toBeInstanceOf(CmiModel);
    expect(context.stateMachine).toBeInstanceOf(PlayerStateMachine);
    expect(context.timing).toBeInstanceOf(TimingController);
    expect(context.backend).toBeInstanceOf(BackendClient);
    expect(context.api).toBeInstanceOf(Scorm12API);
  });
});
