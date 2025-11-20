(function(){
  // jQuery fallback — avoid inline script (keeps CSP strict)
  if (!window.jQuery) {
    // CDN didn't provide jQuery — load the local copy as fallback
    var s = document.createElement('script');
    s.src = 'js/jquery-2.1.1.min.js';
    document.head.appendChild(s);
  }
})();
