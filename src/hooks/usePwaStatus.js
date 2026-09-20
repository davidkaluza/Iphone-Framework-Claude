import { useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

export function usePwaStatus() {
  const [swActive, setSwActive] = useState(false);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegisteredSW(swScriptUrl, registration) {
      console.log("[SW] Registriert:", swScriptUrl);
      if (registration?.active) setSwActive(true);
      registration?.addEventListener("updatefound", () => {
        const installing = registration.installing;
        installing?.addEventListener("statechange", () => {
          if (installing.state === "activated") setSwActive(true);
        });
      });
    },
    onRegisterError(error) {
      console.error("[SW] Registrierung fehlgeschlagen:", error);
    }
  });

  return { swActive, needRefresh, updateServiceWorker };
}
