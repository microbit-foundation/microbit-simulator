(function() {

var components = [
    { component: 'MicrobitDisplay', name: 'Microbit Display', pins: [] },
    { component: 'LightSensor', name: 'Light Sensor', pins: [] },
    { component: 'TemperatureSensor', name: 'Temperature Sensor', pins: [] },
    { component: 'AccelerometerSensorX', name: 'Accelerometer Sensor X', pins: [] },
    { component: 'AccelerometerSensorY', name: 'Accelerometer Sensor Y', pins: [] },
    { component: 'AccelerometerSensorZ', name: 'Accelerometer Sensor Z', pins: [] },
    { component: 'AccelerometerGestures', name: 'Accelerometer Gestures', pins: [] }
];

Module.preRun.push(function() {
    components.forEach(function(c, ix) {
        var component = new window.MbedJSUI[c.component](null);
        component.init();
    });
});

document.querySelector('#overlay').style.display = 'none';

})();