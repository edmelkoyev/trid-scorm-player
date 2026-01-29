import { PlayerStateMachine } from './PlayerStateMachine';


describe('PlayerStateMachine', () => {
  let machine: PlayerStateMachine;

  beforeEach(() => {
    machine = new PlayerStateMachine();
  });

  it('should start in Idle state', () => {
    expect(machine.isInitialized()).toBe(false);
    expect(machine.canInitialize()).toBe(false);
  });

  it('should move to Ready state when setReady is called', () => {
    machine.setReady();

    expect(machine.canInitialize()).toBe(true);
    expect(machine.isInitialized()).toBe(false);
  });

  it('should initialize successfully when in Ready state', () => {
    machine.setReady();

    const result = machine.initialize();

    expect(result).toBe(true);
    expect(machine.isInitialized()).toBe(true);
    expect(machine.canInitialize()).toBe(false);
  });

  it('should NOT initialize when not in Ready state', () => {
    const result = machine.initialize();

    expect(result).toBe(false);
    expect(machine.isInitialized()).toBe(false);
  });

  it('should transition to Terminated state', () => {
    machine.setReady();
    machine.initialize();

    machine.terminate();

    expect(machine.isInitialized()).toBe(false);
    expect(machine.canInitialize()).toBe(false);
  });

  it('should not initialize after termination', () => {
    machine.terminate();

    const result = machine.initialize();

    expect(result).toBe(false);
    expect(machine.isInitialized()).toBe(false);
  });
});
