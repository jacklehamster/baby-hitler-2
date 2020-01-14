const FILES_TO_CACHE = [
  'offline.html',
];

const CACHE_NAME = "cache_test234";

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


addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request)
      	.then(function(response) {
      		cache.put(event.request, response.clone());
      		return response;
      	}).catch(function() {
		  return fetch(event.request);
		});
    })
  );
});


// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.open('mysite-dynamic').then(function(cache) {
//       return cache.match(event.request).then(function (response) {
//         return response || fetch(event.request).then(function(response) {
//           cache.put(event.request, response.clone());
//           return response;
//         });
//       });
//     })
//   );
// });


// addEventListener('fetch', event => {
// 	console.log(event.request);
// 	if (event.request.mode !== 'navigate') {
// 	  // Not a page navigation, bail.
// 	  return;
// 	}
// 	event.respondWith(
// 	    fetch(event.request)
// 	        .catch(() => {
// 	          return caches.open(CACHE_NAME)
// 	              .then((cache) => {
// 	                return cache.match('offline.html');
// 	              });
// 	        })
// 	);
// });

