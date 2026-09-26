self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = { title: '🎾 Pyramide du Club', body: 'Nouvelle notification.' };
  try { data = event.data.json(); } catch (e) { if (event.data) data.body = event.data.text(); }

  event.waitUntil(
    self.registration.showNotification(data.title || '🎾 Pyramide du Club', {
      body: data.body || '',
      icon: 'logo.png',
      badge: 'logo.png',
      data: { url: data.url || '/' }
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});