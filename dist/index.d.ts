/// <reference types="node" />
import { EventEmitter } from 'events';
interface NexitOptions {
    shutdownDelay?: number;
    exitDelay?: number;
}
declare const NEXIT_SHUTDOWN = "NEXIT_SHUTDOWN";
declare const NEXIT_EXIT = "NEXIT_EXIT";
declare class Nexit extends EventEmitter {
    private isShuttingDown;
    private shutdownDelay;
    private exitDelay;
    constructor({ shutdownDelay, exitDelay }?: NexitOptions);
    private bindHandlers;
    private unbindHandlers;
    private graceful;
}
export default Nexit;
export { Nexit, NEXIT_SHUTDOWN, NEXIT_EXIT };
