(function(exports) {

    function BaseComponent() {

    }

    BaseComponent.prototype.pinNameForPin = function(pin) {
        return Object.keys(MbedJSHal.PinNames).find(function(p) {
            return MbedJSHal.PinNames[p] === pin;
        }.bind(this));
    };

    exports.BaseComponent = BaseComponent;

})(window.MbedJSUI);
