import React from "react";

/**
 * @param {{ timeText: string; progress: number; ariaLabel?: string }} props
 */
// PUBLIC_INTERFACE
export default function TimerDisplay({ timeText, progress, ariaLabel }) {
  const safeProgress = Number.isFinite(progress)
    ? Math.min(1, Math.max(0, progress))
    : 0;

  const percent = Math.round(safeProgress * 100);

  return (
    <div className="timer-display">
      <div className="time-text" aria-label={ariaLabel || "Time remaining"}>
        {timeText}
      </div>

      <div className="progress-wrap" aria-label="Progress">
        <div
          className="progress-bar"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Session progress"
        >
          <div
            className="progress-bar__fill"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="progress-meta" aria-hidden="true">
          {percent}%
        </div>
      </div>
    </div>
  );
}
