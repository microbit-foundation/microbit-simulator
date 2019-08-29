(function() {

var components = [ 'MicrobitDisplay',
                   'LightSensor',
                   'TemperatureSensor',
                   'AccelerometerSensorX',
                   'AccelerometerSensorY',
                   'AccelerometerSensorZ',
                   'AccelerometerGestures'];

Module.preRun.push(function() {
    components.forEach(function(c, ix) {
        var component = new window.MbedJSUI[c]();
        component.init();
    });
});

document.querySelector('#overlay').style.display = 'none';

})();