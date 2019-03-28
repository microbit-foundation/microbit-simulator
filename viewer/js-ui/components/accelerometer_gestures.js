(function(exports) {
    function AccelerometerGestures(pins) {
        exports.BaseComponent.call(this);

        this.componentsEl = document.querySelector('#accelerometer');
    }

    AccelerometerGestures.prototype = Object.create(exports.BaseComponent.prototype);

    AccelerometerGestures.prototype.gesture_press = function() {
        this.gesture_pressed = true;
    }

    AccelerometerGestures.prototype.new_gesture = function(name, func) {
        var button = document.createElement('button');
        button.setAttribute('id', name + '_gesture_button');
        button.textContent = name;
        press_func = this.gesture_press.bind(this);
        button.onmousedown = function() {
            press_func();
            func();
        }
        return button;
    }

    AccelerometerGestures.prototype.set = function(name, value) {
        var input = document.querySelector('#' + name + '_sensor_input');
        input.value = value;
        var event = document.createEvent('Event');
        event.initEvent('input', true, true);
        input.dispatchEvent(event);
    }

    AccelerometerGestures.prototype.set_all = function(x, y, z) {
        this.set('Accelerometer_X', x);
        this.set('Accelerometer_Y', y);
        this.set('Accelerometer_Z', z);
    }

    AccelerometerGestures.prototype.mouse_up = function() {
        if (this.gesture_pressed) {
            clearInterval(this.shake_left);
            clearInterval(this.shake_right);
            this.set_all(250, 250, 250);
            this.gesture_pressed = false;
        }
    }

    AccelerometerGestures.prototype.init = function() {
        var self = this;

        var el = self._el = document.createElement('div');
        el.classList.add('component');
        el.classList.add('gestures');
        var p = document.createElement('p');
        p.classList.add('description');

        p.textContent = 'Accelerometer Gestures:';

        var gestures = document.createElement('div');

        gestures.appendChild(self.new_gesture('None', self.mouse_up.bind(self)));
        gestures.appendChild(self.new_gesture('Tilt Up', self.tilt_up.bind(self)));
        gestures.appendChild(self.new_gesture('Tilt Down', self.tilt_down.bind(self)));
        gestures.appendChild(self.new_gesture('Tilt Left', self.tilt_left.bind(self)));
        gestures.appendChild(self.new_gesture('Tilt Right', self.tilt_right.bind(self)));
        gestures.appendChild(self.new_gesture('Face Up', self.face_up.bind(self)));
        gestures.appendChild(self.new_gesture('Face Down', self.face_down.bind(self)));
        gestures.appendChild(self.new_gesture('Freefall', self.freefall.bind(self)));
        gestures.appendChild(self.new_gesture('3G', self.three_g.bind(self)));
        gestures.appendChild(self.new_gesture('6G', self.six_g.bind(self)));
        gestures.appendChild(self.new_gesture('8G', self.eight_g.bind(self)));
        gestures.appendChild(self.new_gesture('Shake', self.shake_on.bind(self)));

        document.onmouseup = self.mouse_up.bind(self);

        p.appendChild(gestures);
        el.appendChild(p);
        self.componentsEl.appendChild(el);
    };

    AccelerometerGestures.prototype.freefall = function() {
        this.set_all(0, 0, 0);
    }

    AccelerometerGestures.prototype.tilt_left = function() {
        this.set_all(-1000, 0, 0);
    }

    AccelerometerGestures.prototype.tilt_right = function() {
        this.set_all(1000, 0, 0);
    }

    AccelerometerGestures.prototype.tilt_up = function() {
        this.set_all(0, 1000, 0);
    }

    AccelerometerGestures.prototype.tilt_down = function() {
        this.set_all(0, -1000, 0);
    }

    AccelerometerGestures.prototype.face_up = function() {
        this.set_all(0, 0, -1000);
    }

    AccelerometerGestures.prototype.face_down = function() {
        this.set_all(0, 0, 1000);
    }

    AccelerometerGestures.prototype.three_g = function() {
        this.set_all(2000, 2000, 2000);
        setTimeout(this.mouse_up.bind(this), 500);
    }

    AccelerometerGestures.prototype.six_g = function() {
        this.set_all(4000, 4000, 4000);
        setTimeout(this.mouse_up.bind(this), 500);
    }

    AccelerometerGestures.prototype.eight_g = function() {
        this.set_all(5000, 5000, 5000);
        setTimeout(this.mouse_up.bind(this), 500);
    }

    AccelerometerGestures.prototype.shake_on = function() {
        self = this;
        var wait = 250;
        clearInterval(self.shake_left);
        clearInterval(self.shake_right);
        self.set.bind(self, 'Accelerometer_X', 500);
        self.shake_left = setInterval(self.set.bind(self, 'Accelerometer_X', 500), wait);
        setTimeout(function() {
            self.set.bind(self, 'Accelerometer_X', -500);
            self.shake_right = setInterval(self.set.bind(self, 'Accelerometer_X', -500), wait);
        }, wait / 2);
    }

    AccelerometerGestures.prototype.destroy = function() {
        window.removeComponent(this);

        this.componentsEl.removeChild(this._el);
    };

    exports.AccelerometerGestures = AccelerometerGestures

})(window.MbedJSUI);
