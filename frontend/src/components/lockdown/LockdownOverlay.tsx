import { useTestSessionStore } from "../../stores/testSessionStore";

const VIOLATION_LABELS: Record<string, string> = {
  TAB_BLUR: "You switched away from this tab/window.",
  FULLSCREEN_EXIT: "You exited fullscreen mode.",
  COPY_PASTE_ATTEMPT: "Copy/paste is disabled during the test.",
  DEVTOOLS_ATTEMPT: "Developer tools shortcuts are disabled during the test.",
  CONTEXT_MENU_ATTEMPT: "Right-click is disabled during the test.",
};

export function LockdownOverlay() {
  const { violationCount, lastViolationType } = useTestSessionStore();

  if (violationCount === 0) return null;

  return (
    <div className="lockdown-banner" role="alert">
      <strong>Monitored test environment — violation {violationCount} recorded.</strong>
      <div>{lastViolationType ? VIOLATION_LABELS[lastViolationType] : null}</div>
      <div className="lockdown-banner__sub">
        One more violation will auto-submit this test. Stay in fullscreen and on this tab.
      </div>
    </div>
  );
}
