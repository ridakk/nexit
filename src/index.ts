import { EventEmitter } from 'events';

interface NexitOptions {
  shutdownDelay?: number;
  exitDelay?: number;
}

const NEXIT_SHUTDOWN = 'NEXIT_SHUTDOWN';
const NEXIT_EXIT = 'NEXIT_EXIT';

class Nexit extends EventEmitter {
  private isShuttingDown: boolean;
  private shutdownDelay: number;
  private exitDelay: number;
  constructor({ shutdownDelay = 30000, exitDelay = 300 }: NexitOptions = {}) {
    super();
    this.isShuttingDown = false;
    this.shutdownDelay = shutdownDelay;
    this.exitDelay = exitDelay;

    this.graceful = this.graceful.bind(this);

    this.bindHandlers();
  }

  private bindHandlers(): void {
    process.on('uncaughtException', this.handleUncaughtException.bind(this));
    process.on('SIGTERM', this.handleSignal.bind(this, 'SIGTERM'));
    process.on('SIGINT', this.handleSignal.bind(this, 'SIGINT'));
  }

  private unbindHandlers(): void {
    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('SIGTERM');
    process.removeAllListeners('SIGINT');
  }

  private handleSignal(signal: string): void {
    this.graceful(signal, new Error(signal));
  }

  private handleUncaughtException(err: Error): void {
    this.graceful('uncaughtException', err);
  }

  private graceful(signal: string, err: Error): void {
    if (this.isShuttingDown) {
      return;
    }

    this.isShuttingDown = true;
    this.unbindHandlers();
    this.emit(NEXIT_SHUTDOWN, err, signal);

    setTimeout(() => {
      this.emit(NEXIT_EXIT);

      setTimeout(() => {
        // .unref is required to not to block event loop to wait until
        // this timer to expire if process is able to exit on its own.
        process.exit(1); // eslint-disable-line no-process-exit
      }, this.exitDelay).unref();

      // We can set process.exitCode and allow the process to exit
      // naturally once event loop is empty
      //
      // But need to be sure that we are avoiding scheduling any
      // additional work for the event loop otherwise will
      // always be shutting down forcefully with timer above.
      //
      // Any existing timers, open connections to dbs etc...
      // must be closed in order to perform graceful shutdown
      // properly.
      process.exitCode = 1;
    }, this.shutdownDelay);
  }
}

export default Nexit;
export { Nexit, NEXIT_SHUTDOWN, NEXIT_EXIT };
