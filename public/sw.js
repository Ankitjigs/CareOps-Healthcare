globalThis.addEventListener("install", (event) => {
  event.waitUntil(globalThis.skipWaiting());
});

globalThis.addEventListener("activate", (event) => {
  event.waitUntil(globalThis.clients.claim());
});

globalThis.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const route = event.notification.data?.route || "patients";
  const patientId = event.notification.data?.patientId;
  event.waitUntil(
    globalThis.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const visibleClient = clients.find((client) => "focus" in client);
      if (visibleClient) {
        visibleClient.postMessage({ type: "NAVIGATE", route, patientId });
        return visibleClient.focus();
      }
      return globalThis.clients.openWindow("/");
    }),
  );
});
