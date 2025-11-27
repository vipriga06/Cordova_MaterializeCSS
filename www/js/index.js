// Wait for the deviceready event before using any of Cordova's device APIs.
// If running in a browser (no Cordova), initialise when DOM is ready.

function initMaterialize() {
  try { M.AutoInit(); } catch (e) { console.warn('Materialize not loaded yet', e); }

  var options = { swipeable: true };
  var tabsEls = document.querySelectorAll('.tabs');
  var tabsInstances = M.Tabs.init(tabsEls, options);

  // Inicializar sidenav si existe
  var sidenavEls = document.querySelectorAll('.sidenav');
  M.Sidenav.init(sidenavEls);

  // Vincular enlaces del sidenav a los tabs (si hacen referencia a #tabN)
  var tabsEl = document.getElementById('tabs-swipe-demo');
  var tabsInstance = null;
  if (tabsEl) {
    tabsInstance = M.Tabs.getInstance(tabsEl) || tabsInstances[0];
  }

  document.querySelectorAll('.sidenav a[href^="#tab"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var target = this.getAttribute('href').replace('#', '');
      if (tabsInstance && target) {
        tabsInstance.select(target);
      }
      // cerrar sidenav
      var sidenav = document.querySelector('.sidenav');
      var sidenavInstance = sidenav && M.Sidenav.getInstance(sidenav);
      if (sidenavInstance) sidenavInstance.close();
      ev.preventDefault();
    });
  });
}

function onDeviceReady() {
  console.log('Running cordova-' + (window.cordova && cordova.platformId) + '@' + (window.cordova && cordova.version));
  initMaterialize();
}

// Cordova deviceready
if (window.cordova) {
  document.addEventListener('deviceready', onDeviceReady, false);
} else {
  // Fallback para navegador: inicializar cuando DOM cargue
  document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM cargado (navegador). Inicializando Materialize.');
    initMaterialize();
  });
}
