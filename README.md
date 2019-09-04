# BBC micro:bit simulator

This project is a fork of the [Mbed Simulator](https://github.com/janjongboom/mbed-simulator) that has been modified in order to simulate the BBC micro:bit in browser using [Emscripten](https://emscripten.org/). The project has been stripped down to the necessary parts and Javascript added to simulate micro:bit specific peripherals.

The simulator is currently used to run [MicroPython scripts in browser](https://github.com/geowor01/micropython), which is used by the [MicroPython Editor](https://github.com/bbcmicrobit/PythonEditor).

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

    Will build the docker image that will be used to build the simulator, this will install all required dependencies and clone all necessary git repositories, including the [MicroPython simulator](https://github.com/geowor01/micropython).

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

Follow the testing instructions in the [MicroPython simulator](https://github.com/geowor01/micropython) README.