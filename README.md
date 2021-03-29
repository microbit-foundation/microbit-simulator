# BBC micro:bit simulator

This project is a fork of the [Mbed Simulator](https://github.com/janjongboom/mbed-simulator) that has been modified in order to simulate the BBC micro:bit in browser using [Emscripten](https://emscripten.org/). The project has been stripped down to the necessary parts and Javascript added to simulate micro:bit specific peripherals.

The simulator is currently used to run [MicroPython scripts in browser](https://github.com/microbit-foundation/micropython-simulator), which is used by the [MicroPython Editor](https://github.com/bbcmicrobit/PythonEditor).

## Docs

* Installation, see below.
* [Configuration and compiler options](docs/simconfig.md)
* [Debugging](docs/debugging.md)
* [Architecture](docs/architecture.md)

## Building the MicroPython simulator

The simulator currently requires [Docker](https://www.docker.com/) and [Node](https://nodejs.org) to build.

If using Linux you may also need to follow the instructions under ["Manage Docker as a non-root user"](https://docs.docker.com/install/linux/linux-postinstall/) to prevent docker requiring `sudo`.

After cloning the repository, run the following commands to build:


1.
    ```
    $ npm run init
    ```
    > **WARNING**: This command will reset all git repositories within the development environment, do not use after changes have been made.

    Will build the docker image that will be used to build the simulator, this will install all required dependencies and clone all necessary git repositories, including the [MicroPython simulator](https://github.com/microbit-foundation/micropython-simulator).

2.
    ```
    $ npm run build
    ```
    > **NOTE**: When making changes to any C/C++ code outside of the micropython repository, you may need to use `npm run build:full` instead.

    Will build the simulator from source inside the docker image.

3.
    ```
    $ npm run serve
    ```
    Will serve the simulator at a given URL.


If you want to force a rebuild of the image, run `npm run build:dockerimage-clean`.

If you want to reset all cloned repositories to their initial state, run `npm run wipe-dependencies` and `npm run init`.

## Testing

Follow the testing instructions in the [MicroPython simulator](https://github.com/microbit-foundation/micropython-simulator) README.

## Integrating the simulator

An example of using the simulator within another web page is the BBC micro:bit [Python Editor](https://github.com/microbit-foundation/python-editor).

The .js and .wasm files in /micropython-simulator/BUILD/SIMULATOR/ are copied over, along with the /viewer directory.

The simulator is contained within an iframe like so `<iframe class='simulator-frame' src='/simulator/viewer/viewer.html'></iframe>`.

Changes made to the simulator were as follows:
- This requires the src of elements in viewer/viewer.html to be altered to point to the correct locations.
- Changing the styling in /viewer/style/simulator.css.
- Removing the script div from /viewer/viewer.html.

When containing the simulator in an iframe, the following functions must be implemented in the parent window:

-
    ```
    window.broadcastSimulatorMessage(simwindow, packet)
    ```
    Handles radio messages sent by an instance of the simulator, used to send the messages to the other instances.

-
    ```
    window.closeSimulator(simwindow)
    ```
    Used to possibly remove the simulator's iframe or close in another form.

-
    ```
    window.getSimulatorScript(simwindow)
    ```
    Returns the script to be run by the simulator (can be an empty string to use the REPL).

-
    ```
    window.getSimulatorFileSystemSize(simwindow)
    ```
    Returns the size of the filesystem to be used. Returning a value higher than max will set the filesystem to its maximum size.

-
    ```
    window.initialiseSimulator(simwindow)
    ```
    Called when the simulator is being initialised. Can be used to write to the filesystem using `simwindow.MbedJSUI.write_file(fileName, bytes)` where bytes is a `Uint8Array`.

The `simwindow` is the `contentWindow` of the simulator that has called the function.
The simulator uses `window.parent` to access these functions. When no parent exists, `window.parent` points to `window`, and so these calls make use of the implementations found in `init.js`.

## Code of Conduct

Trust, partnership, simplicity and passion are our core values we live and breathe in our daily work life and within our projects. Our open-source projects are no exception. We have an active community which spans the globe and we welcome and encourage participation and contributions to our projects by everyone. We work to foster a positive, open, inclusive and supportive environment and trust that our community respects the micro:bit code of conduct. Please see our [code of conduct](https://microbit.org/safeguarding/) which outlines our expectations for all those that participate in our community and details on how to report any concerns and what would happen should breaches occur.
