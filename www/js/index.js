
var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        if (!parentElement) return;
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        if (listeningElement) listeningElement.style.display = 'none';
        if (receivedElement) receivedElement.style.display = 'block';

        console.log('Received Event: ' + id);
    }
};

app.initialize();
	var lastResults = null;

