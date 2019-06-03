# Precompiled MicroPython Simulator

A precompiled copy of [MicroPython](https://github.com/geowor01/micropython/tree/simulator) with the required javascript files and node modules.

Requires [node](https://nodejs.org/en/) to run.

Run `node server.js` to launch the server. Then go to [simulator](http://localhost:7829/).

# Version

Mbed Simulator micro:bit: https://github.com/geowor01/mbed-simulator-microbit/#fd83a5af0de2489fec9f47acc11793515dcc4aa1
with [ccall-patch.js](https://github.com/geowor01/mbed-simulator-microbit/blob/master/ccall-patch.js) applied to emscripten.
Microbit-dal: https://github.com/geowor01/microbit-dal/#84079f33c4e269f5f2d205a5d5ae3d960f1d472d
MicroPython: https://github.com/geowor01/micropython/commits/simulator commit b15ed935df2515e8463196003c41ce9421a1febc.