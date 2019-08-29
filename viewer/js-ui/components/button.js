(function(exports) {
    function Button(pin) {
        this.pin = pin;
    }

    Button.prototype.init = function() {};

    Button.prototype.press = function(pressTime) {
        this.down();
        setTimeout(this.up.bind(this), [pressTime]);
    };

    Button.prototype.down = function() {
        window.MbedJSHal.gpio.write(this.pin, 0)
    };

    Button.prototype.up = function() {
        window.MbedJSHal.gpio.write(this.pin, 1);
    };

    exports.ButtonA = new Button(17)
    exports.ButtonB = new Button(26)

    const initializeMicrobitButtons = buttons => {
        var currentButton = null;
        buttons.onmousedown = function(e) {
            if (currentButton != null) return
            for (var i = 0; i < e.path.length; i++) {
                if (e.path[i].id == 'use8162') {
                    currentButton = window.MbedJSUI.ButtonB;
                    currentButton.down();
                    return;
                }
            }
            currentButton = window.MbedJSUI.ButtonA;
            currentButton.down();
        };
        buttons.onmouseup = function(e) {
            currentButton.up();
            currentButton = null;
        };
    }

    var svg = document.querySelector('#microbit-svg');

    if (svg.contentDocument && svg.contentDocument.rootElement) {
        var callback = function() {
            buttons = svg.contentDocument.querySelector('#ButtonGroup');
            if (buttons == null) {
                setTimeout(callback, 100);
            }
            else {
                initializeMicrobitButtons(buttons);
            }
        };
        callback();
    }
    else {
        svg.addEventListener('load', function() {
            initializeMicrobitButtons(svg.contentDocument);
        });
    }

})(window.MbedJSUI);
