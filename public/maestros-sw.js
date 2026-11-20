'use strict';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('push', event => {
  let data = {};
  try { data = event.data?.json() || {}; } catch {}
  event.waitUntil(self.registration.showNotification(data.title || 'MAESTROS · Νέα παραγγελία', {
    body: data.body || 'Πατήστε για να δείτε τη διαχείριση.',
    tag: data.tag || 'maestros-order',
    icon: '/maestros-icon.svg', badge: '/maestros-icon.svg',
    vibrate: [200, 100, 200], renotify: true,
    data: { path: '/?admin=1' }
  }));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil((async () => {
    const target = new URL('/?admin=1', self.location.origin).href;
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const existing = windows.find(client => new URL(client.url).origin === self.location.origin);
    if (existing) {
      await existing.focus();
      existing.postMessage({ type: 'MAESTROS_OPEN_ADMIN' });
    } else await self.clients.openWindow(target);
  })());
});
