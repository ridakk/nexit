"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var NEXIT_SHUTDOWN = 'NEXIT_SHUTDOWN';
exports.NEXIT_SHUTDOWN = NEXIT_SHUTDOWN;
var NEXIT_EXIT = 'NEXIT_EXIT';
exports.NEXIT_EXIT = NEXIT_EXIT;
var Nexit = (function (_super) {
    __extends(Nexit, _super);
    function Nexit(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.shutdownDelay, shutdownDelay = _c === void 0 ? 30000 : _c, _d = _b.exitDelay, exitDelay = _d === void 0 ? 300 : _d;
        var _this = _super.call(this) || this;
        _this.isShuttingDown = false;
        _this.shutdownDelay = shutdownDelay;
        _this.exitDelay = exitDelay;
        _this.bindHandlers();
        return _this;
    }
    Nexit.prototype.bindHandlers = function () {
        process.on('uncaughtException', this.graceful.bind(this));
        process.on('SIGTERM', this.graceful.bind(this));
        process.on('SIGINT', this.graceful.bind(this));
    };
    Nexit.prototype.unbindHandlers = function () {
        process.removeAllListeners('uncaughtException');
        process.removeAllListeners('SIGTERM');
        process.removeAllListeners('SIGINT');
    };
    Nexit.prototype.graceful = function () {
        var _this = this;
        if (this.isShuttingDown) {
            return;
        }
        this.isShuttingDown = true;
        this.unbindHandlers();
        this.emit(NEXIT_SHUTDOWN);
        setTimeout(function () {
            _this.emit(NEXIT_EXIT);
            setTimeout(function () {
                process.exit(1);
            }, _this.exitDelay).unref();
            process.exitCode = 1;
        }, this.shutdownDelay);
    };
    return Nexit;
}(events_1.EventEmitter));
exports.Nexit = Nexit;
exports.default = Nexit;
