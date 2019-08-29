(function(exports) {
    function RadioPacketManager() {}

    RadioPacketManager.prototype.init = function() {};

    RadioPacketManager.prototype.receive = function(packet) {
        ccall('radio_receive', 'null',['array'], [packet]);
    }

    RadioPacketManager.prototype.broadcast = function(packet) {
        console.log(packet);
    }

    exports.RadioPacketManager = RadioPacketManager;

})(window.MbedJSUI);
