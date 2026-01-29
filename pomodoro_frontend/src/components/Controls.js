import React from "react";

/**
 * @param {{ isRunning: boolean; onStart: () => void; onPause: () => void; onReset: () => void }} props
 */
// PUBLIC_INTERFACE
export default function Controls({ isRunning, onStart, onPause, onReset }) {
  return (
    <div className="controls" aria-label="Timer controls">
      <button
        type="button"
        className="btn btn-primary"
        onClick={onStart}
        disabled={isRunning}
        aria-label="Start timer"
      >
        Start
      </button>

      <button
        type="button"
        className="btn btn-secondary"
        onClick={onPause}
        disabled={!isRunning}
        aria-label="Pause timer"
      >
        Pause
      </button>

      <button
        type="button"
        className="btn btn-ghost"
        onClick={onReset}
        aria-label="Reset timer"
      >
        Reset
      </button>
    </div>
  );
}
