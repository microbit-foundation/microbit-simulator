(function(exports) {
    function Sensor(parent, name, min, max, step, start, pins) {
        this.parent = parent;
        this.name = name;
        this.min = min;
        this.max = max;
        this.step = step;
        this.start = start;
    }

    Sensor.prototype.init = function() {
        var self = this;

        var el = self._el = document.createElement('div');
        el.classList.add('component');
        el.classList.add('sensor');
        var p = document.createElement('p');
        p.classList.add('description');

        p.textContent = self.name + ' Sensor: ';
        el.appendChild(p);

        var range = document.createElement('input');
        range.setAttribute('id', self.name + '_sensor_input');
        range.setAttribute('min', self.min);
        range.setAttribute('max', self.max);
        range.step = self.step;
        range.value = self.start;
        range.setAttribute('type', 'range');
        range.addEventListener("input", self.update_value.bind(self, self.name));
        self.range = range;


        var value = document.createElement('div');
        value.setAttribute('id', self.name + '_sensor_title');
        value.textContent = range.value;
        p.appendChild(value);

        var rangeP = document.createElement('p');
        rangeP.appendChild(range);

        el.appendChild(rangeP);

        var SensorP = document.createElement('p');
        var SensorMin = document.createElement('span');
        SensorMin.classList.add('sensor-min');
        SensorMin.textContent = self.min.toString(10);
        var SensorMax = document.createElement('span');
        SensorMax.classList.add('sensor-max');
        SensorMax.textContent = self.max.toString(10);

        SensorP.appendChild(SensorMin);
        SensorP.appendChild(SensorMax);

        el.appendChild(SensorP);

        document.querySelector('#' + self.parent).appendChild(el);
    };

    Sensor.prototype.update_value = function(name, event) {
        document.querySelector('#' + name + '_sensor_title').textContent = event.srcElement.value;
    }

    Sensor.prototype.read = function(name) {
        return document.querySelector('#' + name + '_sensor_input').valueAsNumber;
    }

    Sensor.prototype.new = function(parent, name, min, max, step, start) {
        var sensor = Sensor.bind(Sensor, parent, name, min, max, step, start);
        sensor.read = Sensor.prototype.read.bind(Sensor, name);
        return sensor;
    }

    exports.LightSensor = Sensor.prototype.new('sensors', 'Light', 0, 250, 1, 125);
    exports.TemperatureSensor =  Sensor.prototype.new('sensors', 'Temperature', -50, 100, 1, 25);
    exports.AccelerometerSensorX =  Sensor.prototype.new('accelerometer', 'Accelerometer_X', -5000, 5000, 1, 250);
    exports.AccelerometerSensorY =  Sensor.prototype.new('accelerometer', 'Accelerometer_Y', -5000, 5000, 1, 250);
    exports.AccelerometerSensorZ =  Sensor.prototype.new('accelerometer', 'Accelerometer_Z', -5000, 5000, 1, 250);

})(window.MbedJSUI);
