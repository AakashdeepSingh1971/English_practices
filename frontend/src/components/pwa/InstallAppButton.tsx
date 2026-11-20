import { useState } from "react";
import { isIos, isStandalone, promptInstall, useCanInstall } from "../../pwa";

const IOS_HINT_KEY = "ielts-prep-ios-install-hint-dismissed";

function readDismissed() {
  try {
    return localStorage.getItem(IOS_HINT_KEY) === "1";
  } catch {
    return false;
  }
}

// Shows "Install app" where the browser supports it (Chrome, Edge, Android).
// iPhone/iPad Safari has no install prompt, so it shows how to add the app
// from the Share menu instead. Hidden inside the installed app itself.
export function InstallAppButton() {
  const canInstall = useCanInstall();
  const [iosHintOpen, setIosHintOpen] = useState(false);
  const [iosDismissed, setIosDismissed] = useState(readDismissed);

  if (isStandalone()) return null;

  if (canInstall) {
    return (
      <button className="secondary" onClick={() => void promptInstall()}>
        Install app
      </button>
    );
  }

  if (isIos() && !iosDismissed) {
    const dismiss = () => {
      try {
        localStorage.setItem(IOS_HINT_KEY, "1");
      } catch {
        // private mode: the hint just shows again next time
      }
      setIosDismissed(true);
    };
    return (
      <span className="install-ios">
        <button className="secondary" onClick={() => setIosHintOpen((o) => !o)}>
          Install app
        </button>
        {iosHintOpen && (
          <span className="install-ios__hint" role="dialog">
            In Safari, tap <strong>Share</strong>, then <strong>Add to Home Screen</strong>. You'll need to sign in once
            inside the app.
            <button className="secondary" onClick={dismiss}>
              Got it
            </button>
          </span>
        )}
      </span>
    );
  }

  return null;
}
