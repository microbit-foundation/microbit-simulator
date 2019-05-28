(function(exports) {
    function Button(pin, pins) {
        exports.BaseComponent.call(this);
        this.pin = pin;
    }

    Button.prototype = Object.create(exports.BaseComponent.prototype);

    Button.prototype.init = function() {};

    Button.prototype.destroy = function() {
        window.removeComponent(this);
    };

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

    const initializeMicrobitButtons = svgDocument => {
        buttons = svgDocument.querySelector('#ButtonGroup');
        buttons.onmousedown = function(e) {
            for (var i = 0; i < e.path.length; i++) {
                if (e.path[i].id == 'use8162') {
                    window.MbedJSUI.ButtonB.down();
                    return;
                }
            }
            window.MbedJSUI.ButtonA.down();
        };
        buttons.onmouseup = function(e) {
            for (var i = 0; i < e.path.length; i++) {
                if (e.path[i].id == 'use8162') {
                    window.MbedJSUI.ButtonB.up();
                    return;
                }
            }
            window.MbedJSUI.ButtonA.up();
        };
    }

    var svg = document.querySelector('#microbit-svg');

    if (svg.contentDocument && svg.contentDocument.rootElement) {
        initializeMicrobitButtons(svg.contentDocument);
    }
    else {
        svg.addEventListener('load', function() {
            initializeMicrobitButtons(svg.contentDocument);
        });
    }

})(window.MbedJSUI);
