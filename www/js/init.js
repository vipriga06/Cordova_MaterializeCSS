// Initialize Materialize once jQuery + Materialize are available
function materializeInit(){
  if (typeof window.jQuery === 'undefined') return setTimeout(materializeInit, 50);
  try{
    $('.sidenav').sidenav();
    // Inicialitzar tabs amb swipeable
    $('.tabs').tabs({ swipeable: true });
  }catch(e){
    // If Materialize or jQuery is not ready yet, retry once
    setTimeout(materializeInit, 100);
  }
}
materializeInit();

// Cordova deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    // Aquí es podria mostrar l'estat en pantalla si cal
}
