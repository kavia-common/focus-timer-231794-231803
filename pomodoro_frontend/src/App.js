import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import TimerDisplay from "./components/TimerDisplay";
import Controls from "./components/Controls";

const WORK_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

/**
 * Formats a number of seconds into MM:SS.
 */
function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

/**
 * Returns the session duration for a given session type.
 */
function getSessionDurationSeconds(sessionType) {
  return sessionType === "work" ? WORK_SECONDS : BREAK_SECONDS;
}

// PUBLIC_INTERFACE
function App() {
  /** "work" | "break" */
  const [sessionType, setSessionType] = useState("work");
  const [secondsRemaining, setSecondsRemaining] = useState(WORK_SECONDS);
  const [isRunning, setIsRunning] = useState(false);

  // Keep interval id outside of React state to avoid re-renders.
  const intervalRef = useRef(null);

  const sessionDurationSeconds = useMemo(
    () => getSessionDurationSeconds(sessionType),
    [sessionType]
  );

  const progress = useMemo(() => {
    const elapsed = sessionDurationSeconds - secondsRemaining;
    if (sessionDurationSeconds <= 0) return 0;
    return Math.min(1, Math.max(0, elapsed / sessionDurationSeconds));
  }, [secondsRemaining, sessionDurationSeconds]);

  // Tick logic
  useEffect(() => {
    if (!isRunning) return undefined;

    // Ensure there is never more than one interval running.
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [isRunning]);

  // Auto-switch when the timer hits 0
  useEffect(() => {
    if (!isRunning) return;
    if (secondsRemaining !== 0) return;

    setSessionType((prev) => (prev === "work" ? "break" : "work"));
    // Keep running and immediately reset remaining seconds to the next session duration.
    // Using functional form ensures correct next session duration.
    setSecondsRemaining(() => {
      const nextSessionType = sessionType === "work" ? "break" : "work";
      return getSessionDurationSeconds(nextSessionType);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsRemaining, isRunning]);

  // When sessionType changes (manually or via auto-switch), ensure the remaining time
  // matches the start of that session if it was changed externally.
  useEffect(() => {
    setSecondsRemaining((prev) => {
      const expected = getSessionDurationSeconds(sessionType);
      // If we just switched sessions, we already set it. Otherwise normalize.
      if (prev > expected) return expected;
      if (prev === 0) return expected;
      return prev;
    });
  }, [sessionType]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, []);

  // PUBLIC_INTERFACE
  const handleStart = () => {
    setIsRunning(true);
  };

  // PUBLIC_INTERFACE
  const handlePause = () => {
    setIsRunning(false);
  };

  // PUBLIC_INTERFACE
  const handleReset = () => {
    // Reset to the start of the *current* session (as requested).
    setIsRunning(false);
    setSecondsRemaining(getSessionDurationSeconds(sessionType));
  };

  const sessionLabel = sessionType === "work" ? "Work" : "Break";

  return (
    <div className="App">
      <main className="pomodoro-page">
        <section className="pomodoro-card" aria-label="Pomodoro timer">
          <header className="pomodoro-header">
            <div className="session-badge" aria-label="Current session">
              <span className="session-dot" aria-hidden="true" />
              <span className="session-label">{sessionLabel}</span>
            </div>
            <p className="session-subtitle">
              {sessionType === "work" ? "Focus time" : "Rest time"}
            </p>
          </header>

          <TimerDisplay
            ariaLabel="Time remaining"
            timeText={formatTime(secondsRemaining)}
            progress={progress}
          />

          <Controls
            isRunning={isRunning}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
          />

          <footer className="pomodoro-footer">
            <p className="helper-text">
              Auto-switches between 25:00 work and 05:00 break.
            </p>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
