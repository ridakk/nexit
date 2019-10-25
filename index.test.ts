import { Nexit, NEXIT_EXIT, NEXIT_SHUTDOWN } from './index';

jest.useFakeTimers();

describe('Nexit', () => {
  beforeAll(() => {
    const processEvents: any = {};

    process.on = jest.fn((signal: any, cb: any): any => {
      processEvents[signal] = cb;
    });

    process.kill = jest.fn((pid, signal) => {
      processEvents[signal]();
    });

    jest.spyOn(process, 'exit').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('custom parameters', async () => {
    const shutdownListener = jest.fn();
    const exitListener = jest.fn();
    const nexit = new Nexit();
    nexit.on(NEXIT_SHUTDOWN, shutdownListener);
    nexit.on(NEXIT_EXIT, exitListener);

    process.kill(process.pid, 'SIGTERM');

    jest.runAllTimers();

    expect(setTimeout).toHaveBeenCalledTimes(2);
    expect(setTimeout).toHaveBeenNthCalledWith(1, expect.any(Function), 30000);
    expect(setTimeout).toHaveBeenNthCalledWith(2, expect.any(Function), 300);
    expect(shutdownListener).toHaveBeenCalledTimes(1);
    expect(exitListener).toHaveBeenCalledTimes(1);
  });

  it('default parameter values', async () => {
    const shutdownListener = jest.fn();
    const exitListener = jest.fn();
    const nexit = new Nexit({
      shutdownDelay: 10000,
      exitDelay: 100,
    });
    nexit.on(NEXIT_SHUTDOWN, shutdownListener);
    nexit.on(NEXIT_EXIT, exitListener);

    process.kill(process.pid, 'SIGTERM');

    jest.runAllTimers();

    expect(setTimeout).toHaveBeenCalledTimes(2);
    expect(setTimeout).toHaveBeenNthCalledWith(1, expect.any(Function), 10000);
    expect(setTimeout).toHaveBeenNthCalledWith(2, expect.any(Function), 100);
    expect(shutdownListener).toHaveBeenCalledTimes(1);
    expect(exitListener).toHaveBeenCalledTimes(1);
  });

  it('ignore consecutive signals', async () => {
    const shutdownListener = jest.fn();
    const exitListener = jest.fn();
    const nexit = new Nexit();
    nexit.on(NEXIT_SHUTDOWN, shutdownListener);
    nexit.on(NEXIT_EXIT, exitListener);

    process.kill(process.pid, 'SIGTERM');
    process.kill(process.pid, 'SIGTERM');
    process.kill(process.pid, 'SIGTERM');

    jest.runAllTimers();

    expect(setTimeout).toHaveBeenCalledTimes(2);
    expect(setTimeout).toHaveBeenNthCalledWith(1, expect.any(Function), 30000);
    expect(setTimeout).toHaveBeenNthCalledWith(2, expect.any(Function), 300);
    expect(shutdownListener).toHaveBeenCalledTimes(1);
    expect(exitListener).toHaveBeenCalledTimes(1);
  });
});
