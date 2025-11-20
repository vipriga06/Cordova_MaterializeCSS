(function(){
  // Cordova fallback for local dev servers: if `cordova.js` isn't provided by the runtime,
  // create a small stub to avoid errors when testing with a static server like Live Server.
  if (!window.cordova) {
    window.cordova = { platformId: 'browser', version: '0.0.0' };

    // Fire a synthetic deviceready so Cordova-specific listeners execute when developing in the browser
    // (the real Cordova will fire deviceready by itself on device or when using `cordova run browser`).
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(function() { document.dispatchEvent(new Event('deviceready')); }, 1);
    } else {
      document.addEventListener('DOMContentLoaded', function(){
        setTimeout(function() { document.dispatchEvent(new Event('deviceready')); }, 1);
      });
    }
  }
})();
