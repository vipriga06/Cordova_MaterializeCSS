(function(){
  // Try a HEAD request for cordova.js to avoid the script tag 404 on static dev servers.
  // If found, inject the real cordova.js; otherwise load the local stub.
  // We try to dynamically inject the `cordova.js` script and fall back
  // to a dev stub when the injection fails. This avoids making a HEAD
  // request (which shows 404 in browser console) while still giving a
  // reliable fallback for the static server.
  var s = document.createElement('script');
  s.src = 'cordova.js';
  s.onload = function(){ /* cordova loaded */ };
  s.onerror = function(){
    var stub = document.createElement('script');
    stub.src = 'js/cordova-fallback.js';
    document.head.appendChild(stub);
  };
  document.head.appendChild(s);
})();
