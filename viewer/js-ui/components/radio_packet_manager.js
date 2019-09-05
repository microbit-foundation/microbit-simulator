(function(exports) {
    function RadioPacketManager() {}

    class Packet {
        constructor(packet_array) {
            this.source_id = window.MbedJSUI.simulator_id;
            this.array = packet_array;
            this.address = (packet_array[0] | (packet_array[1] << 8) | (packet_array[2] << 16) | (packet_array[3] << 24)) >>> 0;
            this.group = packet_array[4];
            this.payload_length = packet_array[5];
            this.payload = new Uint8Array(packet_array.subarray(6, this.payload_length + 6));
            this.payload_string = this.payload_length < 3 ? "" : new TextDecoder("utf-8").decode(this.payload.subarray(3));
            this.crc = ((packet_array[this.payload_length + 6] << 8) | packet_array[this.payload_length + 7]) >>> 0;
            this.channel = packet_array[this.payload_length + 8];
            this.signal_strength = -packet_array[this.payload_length + 9];
        }
    }

    RadioPacketManager.prototype.receive_history = [];
    RadioPacketManager.prototype.broadcast_history = [];

    RadioPacketManager.prototype.init = function() {};

    RadioPacketManager.prototype.receive = function(packet) {
        if (window.MbedJSUI.ready) {
             ccall('radio_receive', 'null',['array'], [packet.array]);
             RadioPacketManager.prototype.receive_history.push(packet);
         }
    }

    RadioPacketManager.prototype.broadcast = function(packet_array) {
        var packet = new Packet(packet_array);
        window.parent.broadcastSimulatorMessage(window, packet);
        RadioPacketManager.prototype.broadcast_history.push(packet);
    }

    RadioPacketManager.prototype.receive_last_broadcast = function() {
        var length = RadioPacketManager.prototype.broadcast_history.length;
        if (length > 0)
            RadioPacketManager.prototype.receive(RadioPacketManager.prototype.broadcast_history[length - 1]);
    }

    exports.RadioPacketManager = RadioPacketManager;

})(window.MbedJSUI);
