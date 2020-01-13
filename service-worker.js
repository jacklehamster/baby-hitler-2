const FILES_TO_CACHE = [
  'offline.html',
];

const CACHE_NAME = "test12345678";

addEventListener('install', event => {
	event.waitUntil(
	    caches.open(CACHE_NAME).then((cache) => {
	      return cache.addAll(FILES_TO_CACHE);
	    })
	);
});

addEventListener('activate', event => {
	event.waitUntil(
	    caches.keys().then((keyList) => {
	      return Promise.all(keyList.map((key) => {
	        if (key !== CACHE_NAME) {
	          return caches.delete(key);
	        }
	      }));
	    })
	);
});

addEventListener('fetch', event => {
	if (event.request.mode !== 'navigate') {
	  // Not a page navigation, bail.
	  return;
	}
	event.respondWith(
	    fetch(event.request)
	        .catch(() => {
	          return caches.open(CACHE_NAME)
	              .then((cache) => {
	                return cache.match('offline.html');
	              });
	        })
	);
});

