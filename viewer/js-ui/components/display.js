(function(exports) {

    // Used in order to cope with strobing (three rows to strobe, with MicroPython updating the pins twice on each strobe)
    var fadeTime = 6;

    const initializeMicrobitSvg = svgDocument => {
        const colourLayerSelectors = ['#ColourFringeGreen', '#ColourFringeRed', '#ColourFringeBlue', '#ColourFringeYellow'];
        let activeColourLayer = 0;

        const colourLayers = colourLayerSelectors.map(id => svgDocument.querySelector(id));
        const showColourLayer = layer => {
          colourLayers.forEach(other => {
            other.style.display = other === layer ? 'inline' : 'none';
          });
        };
        colourLayers.forEach(layer => {
          layer.style.pointerEvents = 'all';
          layer.onclick = () => {
            activeColourLayer = (activeColourLayer + 1) % colourLayers.length;
            showColourLayer(colourLayers[activeColourLayer]);
          };
        });
        showColourLayer(colourLayers[Math.floor(Math.random() * 4)]);
    }

    DisplayMap =
    [[[0,0], [2,0], [4,0], [4,3], [3,3], [2,3], [1,3], [0,3], [1,2]],
     [[4,2], [0,2], [2,2], [1,0], [3,0], [3,4], [1,4]],
     [[2,4], [4,4], [0,4], [0,1], [1,1], [2,1], [3,1], [4,1], [3,2]]];

    function MicrobitDisplay() {}

    MicrobitDisplay.prototype.init = function() {
        var self = this;

        self.currentTime = 0;

        self.firstColPin = 4;
        self.firstRowPin = 13;

        self.colPinStateList = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        self.rowPinStateList = [0, 0, 0];

        // Store the time in 'row pin writes' that each LED has been on for.
        self.LEDMatrix = [[-1, -1, -1, -1, -1],
                          [-1, -1, -1, -1, -1],
                          [-1, -1, -1, -1, -1],
                          [-1, -1, -1, -1, -1],
                          [-1, -1, -1, -1, -1]];

        MicrobitDisplay.prototype.clear = function() {
            self.clearing = true;
            self.colPinStateList = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            self.rowPinStateList = [0, 0, 0];

            // Store the time in 'row pin writes' that each LED has been on for.
            self.LEDMatrix = [[-1, -1, -1, -1, -1],
                              [-1, -1, -1, -1, -1],
                              [-1, -1, -1, -1, -1],
                              [-1, -1, -1, -1, -1],
                              [-1, -1, -1, -1, -1]];
            self.clearing = false;
            self.timeout = setTimeout(self.update_display.bind(self), 1);
        };

        self._on_pin_write = self.on_pin_write.bind(self);

        window.MbedJSHal.gpio.on('pin_write', self._on_pin_write);

        var svg = document.querySelector('#microbit-svg');

        if (svg.contentDocument && svg.contentDocument.rootElement) {
            initializeMicrobitSvg(svg.contentDocument);
            self.allLit = svg.contentDocument.querySelector('#LEDsOn').querySelectorAll('use');
            MicrobitDisplay.prototype.allLit = self.allLit;
            // Write a row pin to update the display.
            self._on_pin_write(self.firstRowPin, self.rowPinStateList[0], null);
        }
        else {
            svg.addEventListener('load', function() {
                initializeMicrobitSvg(svg.contentDocument);
                self.allLit = svg.contentDocument.querySelector('#LEDsOn').querySelectorAll('use');
                MicrobitDisplay.prototype.allLit = self.allLit;
                // Write a row pin to update the display.
                self._on_pin_write(self.firstRowPin, self.rowPinStateList[0], null);
            });
        }

        for(var i = 0; i < self.rowPinStateList.length; ++i) {
            self.rowPinStateList[i] = MbedJSHal.gpio.read(self.firstRowPin + i);
        }
        for(var i = 0; i < self.colPinStateList.length; ++i) {
            self.colPinStateList[i] = MbedJSHal.gpio.read(self.firstColPin + i);
        }
    };

    MicrobitDisplay.prototype.on_pin_write = function(pin, value, type) {
        if (this.clearing) {
            return;
        }
        if (value === 0 || value === 1) {
            if (pin >= this.firstColPin && pin < this.firstColPin + 9) {
                this.colPinStateList[pin - this.firstColPin] = value;
            }
            else if (pin >= this.firstRowPin && pin < this.firstRowPin + 3) {
                this.rowPinStateList[pin - this.firstRowPin] = value;
            }
            if (this.timeout == null) {
                this.timeout = setTimeout(this.update_display.bind(this), 1);
            }
        }
    };

    MicrobitDisplay.prototype.update_display = function() {
        if (this.clearing) {
            return;
        }
        this.timeout = null;
        for (var i = 0; i < 3; i++) {
            if (this.rowPinStateList[i] == 1) {
                var coords = DisplayMap[i];
                for (var i = 0; i < coords.length; ++i) {
                    if (this.colPinStateList[i] == 0) {
                        this.LEDMatrix[coords[i][1]][coords[i][0]] = this.currentTime;
                    }
                }
            }
        }
        this.currentTime = (this.currentTime + 1) % fadeTime
        for (var i = 0; i < this.LEDMatrix.length; ++i) {
            for (var j = 0; j < this.LEDMatrix[i].length; ++j) {
                const lit = this.allLit[j * 5 + i];
                if (this.LEDMatrix[i][j] == this.currentTime) {
                    this.LEDMatrix[i][j] = -1;
                }
                lit.style.display = (this.LEDMatrix[i][j] == -1) ? 'none' : 'inline';
            }
        }
    }

    var MinOpacity = 0.35;

    MicrobitDisplay.prototype.set_brightness = function(x, y, value) {
        var lit = MicrobitDisplay.prototype.allLit[x * 5 + y];
        value = (MinOpacity * 100) + (parseInt(value) * (1 - MinOpacity))
        temp = Math.max(Math.min(value / 100.0, 1), 0).toString();
        lit.style.opacity = temp;
        lit.style.filter  = 'alpha(opacity=' + value + ')'; // IE fallback
    }

    MicrobitDisplay.prototype.micropython_mode = function() {
        fadeTime = 6;
    }

    MicrobitDisplay.prototype.panic_mode = function() {
        fadeTime = 32;
    }

    exports.MicrobitDisplay = MicrobitDisplay;

})(window.MbedJSUI);

