import { useCallback, useEffect, useRef } from "react";
import { logViolation } from "../../api/attempts";
import { useTestSessionStore } from "../../stores/testSessionStore";
import type { ViolationTypeValue } from "../../types/domain";

const DEVTOOLS_KEY_COMBOS: Array<(e: KeyboardEvent) => boolean> = [
  (e) => e.key === "F12",
  (e) => (e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C"),
  (e) => (e.ctrlKey || e.metaKey) && e.key === "u",
];

interface UseLockdownOptions {
  enabled: boolean;
  attemptId: string | null;
  onAutoSubmit: () => void;
}

interface UseLockdownResult {
  requestFullscreen: () => void;
}

// Best-effort browser-level test lockdown: fullscreen enforcement, tab-switch/
// blur detection, blocked copy/paste/context-menu/devtools shortcuts, and an
// unload guard. This deters casual cheating; it cannot stop a second device
// or screen-mirroring — that tradeoff was explicitly accepted up front.
// One user action often fires several events at once (Alt+Tab fires blur +
// visibilitychange, and in fullscreen also fullscreenchange). Count it once.
const DEDUPE_WINDOW_MS = 1500;

export function useLockdown({ enabled, attemptId, onAutoSubmit }: UseLockdownOptions): UseLockdownResult {
  const isFullscreenRef = useRef(false);
  const lastViolationAtRef = useRef(0);
  // Callers pass a fresh onAutoSubmit every render (the timer re-renders each
  // second). Keeping it and attemptId in refs lets the listener effect below
  // subscribe once per test instead of tearing down — and exiting fullscreen —
  // on every render.
  const onAutoSubmitRef = useRef(onAutoSubmit);
  const attemptIdRef = useRef(attemptId);
  useEffect(() => {
    onAutoSubmitRef.current = onAutoSubmit;
    attemptIdRef.current = attemptId;
  });
  const recordViolation = useTestSessionStore((s) => s.recordViolation);

  const reportViolation = useCallback(
    async (type: ViolationTypeValue) => {
      const now = Date.now();
      if (now - lastViolationAtRef.current < DEDUPE_WINDOW_MS) return;
      lastViolationAtRef.current = now;

      recordViolation(type);
      const id = attemptIdRef.current;
      if (!id) return;
      try {
        const { shouldAutoSubmit } = await logViolation(id, type);
        if (shouldAutoSubmit) onAutoSubmitRef.current();
      } catch {
        // Non-blocking: a failed log call shouldn't crash the test session.
        // The local store count above still reflects the violation for the UI.
      }
    },
    [recordViolation]
  );

  const requestFullscreen = useCallback(() => {
    document.documentElement.requestFullscreen?.().catch(() => {});
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onVisibilityChange = () => {
      if (document.hidden) reportViolation("TAB_BLUR");
    };
    const onBlur = () => reportViolation("TAB_BLUR");
    const onFullscreenChange = () => {
      const isFs = Boolean(document.fullscreenElement);
      if (isFullscreenRef.current && !isFs) {
        reportViolation("FULLSCREEN_EXIT");
      }
      isFullscreenRef.current = isFs;
    };
    const onContextMenu = (e: Event) => {
      e.preventDefault();
      reportViolation("CONTEXT_MENU_ATTEMPT");
    };
    const onCopyPaste = (e: Event) => {
      e.preventDefault();
      reportViolation("COPY_PASTE_ATTEMPT");
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (DEVTOOLS_KEY_COMBOS.some((check) => check(e))) {
        e.preventDefault();
        reportViolation("DEVTOOLS_ATTEMPT");
      }
    };
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("copy", onCopyPaste);
    document.addEventListener("cut", onCopyPaste);
    document.addEventListener("paste", onCopyPaste);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("beforeunload", onBeforeUnload);

    document.body.classList.add("lockdown-active");

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("copy", onCopyPaste);
      document.removeEventListener("cut", onCopyPaste);
      document.removeEventListener("paste", onCopyPaste);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.body.classList.remove("lockdown-active");
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [enabled, reportViolation]);

  return { requestFullscreen };
}
