
 const staticCaheName = 'currency-converter-v3'
 const urlstoCache = [
     staticCaheName
 ]
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(function (registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function (err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

self.addEventListener('install',function(event){
      // files to cache to make our app offline
      event.waitUntil(caches.open(staticCaheName).then(function(cache){
        console.log('Opening cache', cache);
        // add all these url
        return cache.addAll([
        '/',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js',
        'https://fonts.gstatic.com/s/roboto/v15/2UX7WLTfW3W8TclTUvlFyQ.woff',
        'https://fonts.gstatic.com/s/roboto/v15/d-6IYplOFocCacKzxwXSOD8E0i7KZn-EPnyo3HZu7kw.woff'])
      }));  
 })

 // return all of the cached responses

 self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          if (response) {
            return response;
          }
          return fetch(event.request);
        }
      )
    );
  });

 // delete all caches
 self.addEventListener('activate',function(event){
     event.waitUntil(caches.keys().then(function(cacheNames){
         console.log('cacheNames',cacheNames)
         return Promise.all(cacheNames.filter(function(cacheName){
            return cacheName.startsWith('currency-') &&  !urlstoCache.includes(cacheName)
         }).map(function(cacheName){
             return caches.delete(cacheName)
         })
    )}))
 })