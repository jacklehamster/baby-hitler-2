self.importScripts('generated/version.js');


const FILES_TO_CACHE = [
  'offline.html',
  'index.html',
];

const DYNAMIC_FILES = [
	'generated/version.js',
];

addEventListener('install', event => {
	event.waitUntil(
	    caches.open(CACHE_NAME).then((cache) => {
	      return cache.addAll(FILES_TO_CACHE);
	    }).then(function() {
			return self.skipWaiting();
	    })
	);
});

addEventListener('activate', event => {
	event.waitUntil(
	    caches.keys().then((keyList) => {
			Promise.all(keyList.map((key) => {
				if (key !== CACHE_NAME) {
					return caches.delete(key);
				}
			}));
			return self.clients.claim();
	    })
	);
});


addEventListener('fetch', function(event) {
	if (DYNAMIC_FILES.some(file => event.request.url.indexOf(file)>=0)) {
		event.respondWith(fetch(event.request)
	      	.then(function(response) {
		  		const clone = response.clone();
				caches.open(CACHE_NAME).then((cache) => {
		      		cache.put(event.request, clone);
				});
	      		return response;
	      	})
	      	.catch(function(response) {
    			return caches.match(event.request).then(function(response) {
    				return response;
				});
	      	})
      	);
	    return;
	}

	event.respondWith(
		caches.match(event.request).then(function(response) {
		  return response || fetch(event.request)
		  	.then(function(response) {
		  		const clone = response.clone();
				caches.open(CACHE_NAME).then((cache) => {
		      		cache.put(event.request, clone);
				});
		  		return response;
		  	}).catch(function() {
			  return fetch(event.request).then(function(response) {
			  		const clone = response.clone();
					caches.open(CACHE_NAME).then((cache) => {
			      		cache.put(event.request, clone);
					})      		
		      		return response;
		      	});
			});
		})
	);
});