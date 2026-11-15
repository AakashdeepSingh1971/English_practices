import { create } from "zustand";
import type { ViolationTypeValue } from "../types/domain";

interface TestSessionState {
  violationCount: number;
  lastViolationType: ViolationTypeValue | null;
  autoSubmitRequested: boolean;
  recordViolation: (type: ViolationTypeValue) => void;
  requestAutoSubmit: () => void;
  reset: () => void;
}

// Local mirror of violation state for the active test, used by useLockdown and
// read by the LockdownOverlay/TaskRunner without prop drilling. The backend
// (TestAttempt/Violation rows) remains the source of truth across reloads.
export const useTestSessionStore = create<TestSessionState>((set) => ({
  violationCount: 0,
  lastViolationType: null,
  autoSubmitRequested: false,
  recordViolation: (type) =>
    set((state) => ({ violationCount: state.violationCount + 1, lastViolationType: type })),
  requestAutoSubmit: () => set({ autoSubmitRequested: true }),
  reset: () => set({ violationCount: 0, lastViolationType: null, autoSubmitRequested: false }),
}));
