(() => {
  "use strict";

  const statusDot = document.getElementById("statusDot");
  const statusText = document.getElementById("statusText");
  const networkStatusEl = document.getElementById("networkStatus");
  const swStatusEl = document.getElementById("swStatus");
  const displayModeEl = document.getElementById("displayMode");

  let swActive = false;

  function updateStatusUI() {
    const online = navigator.onLine;

    statusDot.classList.toggle("is-online", online);
    statusDot.classList.toggle("is-offline", !online);
    statusDot.classList.toggle("is-sw-active", swActive);

    statusText.textContent = online ? "Online" : "Offline";
    networkStatusEl.textContent = online ? "Online" : "Offline";
    swStatusEl.textContent = swActive ? "Aktiv" : "Nicht aktiv";
  }

  function detectDisplayMode() {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true; // iOS Safari

    displayModeEl.textContent = isStandalone
      ? "Installiert (Standalone)"
      : "Browser-Tab";
  }

  window.addEventListener("online", updateStatusUI);
  window.addEventListener("offline", updateStatusUI);

  detectDisplayMode();
  updateStatusUI();

  // -------------------------------------------------------
  // Service Worker Registrierung
  // -------------------------------------------------------
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./sw.js")
        .then((registration) => {
          console.log("[SW] Registriert:", registration.scope);

          if (registration.active) {
            swActive = true;
            updateStatusUI();
          }

          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (!newWorker) return;

            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "activated") {
                swActive = true;
                updateStatusUI();
              }
            });
          });
        })
        .catch((error) => {
          console.error("[SW] Registrierung fehlgeschlagen:", error);
          swActive = false;
          updateStatusUI();
        });

      navigator.serviceWorker.addEventListener("controllerchange", () => {
        swActive = true;
        updateStatusUI();
      });
    });
  } else {
    console.warn("[SW] Service Worker werden von diesem Browser nicht unterstützt.");
  }
})();
