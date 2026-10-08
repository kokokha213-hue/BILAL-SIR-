importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyAA-czBDazvHoNsPiQEvLWo2PYdhY-37oE",
    authDomain: "mychat-f9042.firebaseapp.com",
    projectId: "mychat-f9042",
    storageBucket: "mychat-f9042.firebasestorage.app",
    messagingSenderId: "293067062135",
    appId: "1:293067062135:web:b3746da488d4145436ff72"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("[SW] Background message:", payload);
    const data = payload.data || {};
    const notification = payload.notification || {};
    const title = notification.title || data.title || "New message";
    const body = notification.body || data.body || "";

    const options = {
        body: body,
        icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOTIgMTkyIj48cmVjdCB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgcng9IjQ4IiBmaWxsPSIjMDcxMTFmIi8+PHBhdGggZD0iTTk2IDQ4IEw2MCAxMjAgTDEwMCAxMDQgTDEzMiAxNDQgTDEwMCAxMjAgTDk2IDQ4IFoiIGZpbGw9IiM0Y2U3YmQiLz48L3N2Zz4=",
        tag: data.chatId || "messenger",
        data: { chatId: data.chatId || "", otherUid: data.otherUid || "" }
    };

    return self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const data = event.notification.data || {};
    const otherUid = data.otherUid || "";
    const urlToOpen = new URL("/", self.location.origin);
    if (otherUid) urlToOpen.searchParams.set("openChat", otherUid);

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true })
            .then((windowClients) => {
                for (const client of windowClients) {
                    if (client.url.startsWith(self.location.origin)) {
                        client.focus();
                        client.postMessage({ type: "OPEN_CHAT", otherUid: otherUid });
                        return;
                    }
                }
                if (clients.openWindow) return clients.openWindow(urlToOpen.toString());
            })
    );
});
