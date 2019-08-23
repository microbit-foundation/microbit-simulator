# BBC micro:bit simulator

This project is a fork of the [Mbed Simulator](https://github.com/janjongboom/mbed-simulator) that has been modified in order to simulate the BBC micro:bit in browser using [Emscripten](https://emscripten.org/). The project has been stripped down to the necessary parts and Javascript added to simulate micro:bit specific peripherals.

The simulator is currently used to run [MicroPython scripts in browser](https://github.com/geowor01/micropython), which is used by the [MicroPython Editor](https://github.com/bbcmicrobit/PythonEditor).

## Docs

* Installation, see below.
* [Configuration and compiler options](docs/simconfig.md)
* [Peripherals](docs/peripherals.md)
* [File systems and block devices](docs/fs.md)
* [Pelion Device Management](docs/pelion.md)
* [Debugging](docs/debugging.md)
* [Architecture](docs/architecture.md)

## Installation

### Prerequisites

1. Install [Mbed CLI](https://github.com/ARMmbed/mbed-cli).
1. Install [Python 2.7](https://www.python.org/downloads/windows/) - **not Python 3!**.
1. Install [Git](https://git-scm.com/).
1. Install [Mercurial](https://www.mercurial-scm.org/wiki/Download).
1. Install [Node.js](https://nodejs.org/en/) v8 or higher.

Make sure that all of these are in your PATH. Verify this by opening a command prompt or terminal, and running:

```
$ where mbed
C:\Python27\Scripts\mbed.exe

$ where node
C:\Program Files\nodejs2\node.exe

$ where git
C:\Program Files\Git\cmd\git.exe

$ where hg
C:\Program Files\TortoiseHg\hg.exe
```

On Linux and macOS use `which` instead of `where`.

If one of the `where` / `which` commands does not yield a path, the utility is not in your PATH.

### Installing Emscripten

To install the Emscripten cross-compilation toolchain, open a command prompt and:

1. Clone the repository and install SDK version 1.38.21:

    ```
    $ git clone https://github.com/emscripten-core/emsdk.git
    $ cd emsdk
    $ emsdk install sdk-1.38.21-64bit
    $ emsdk activate sdk-1.38.21-64bit

    # on Windows only:
    $ emsdk_env.bat --global
    ```

1. Verify that the installation was successful:

    ```
    $ emcc -v
    emcc (Emscripten gcc/clang-like replacement + linker emulating GNU ld) 1.38.21
    ```

1. Find the folder where emcc was installed:

    **Windows**

    ```
    $ where emcc
    C:\simulator\emsdk\emscripten\1.38.21\emcc
    ```

    **macOS and Linux**

    ```
    $ which emcc
    ~/toolchains/emsdk/emscripten/1.38.21/emcc
    ```

1. Add this folder to your PATH.
    * On Windows:
        * Go to **System Properties > Advanced > Environmental variables**.
        * Find `PATH`.
        * Add the folder you found in the previous step, and add it prefixed by `;`. E.g.: `;C:\simulator\emsdk\emscripten\1.38.21\`
    * On macOS / Linux:
        * Open `~/.bash_profile` or `~/.bashrc` and add:

        ```
        PATH=$PATH:~/toolchains/emsdk/emscripten/1.38.21
        ```

1. Open a new command prompt and verify that `emcc` can still be found by running:

    ```
    $ where emcc
    C:\simulator\emsdk\emscripten\1.38.21\emcc
    ```

1. All set!

### Installing the simulator

1. Install the simulator through git:

    ```
    $ git clone https://github.com/janjongboom/mbed-simulator.git
    $ cd mbed-simulator
    $ npm install
    $ npm install . -g
    ```

### Running the simulator

If running the MicroPython port then follow the instructions at https://github.com/geowor01/micropython.

1. Clone an Mbed OS example program:

    ```
    $ mbed import mbed-os-example-blinky
    $ cd mbed-os-example-blinky
    ```

1. Run the simulator:

    ```
    $ mbed-simulator .
    ```

    Note that this will download all dependencies (including Mbed OS) and will build the common `libmbed` library so this'll take some time.

1. Done! The Mbed Simulator should now launch in your default browser.

### Troubleshooting

**Windows: [Error 87] The parameter is incorrect**

This error is thrown on Windows systems when the path length limit is hit. Move the `mbed-simulator` folder to a folder closer to root (e.g. `C:\mbed-simulator`).

## How to run the precompiled version of MicroPython

1. Run `node server.js` in `/precompiled`.
1. Open http://localhost:7829 in your browser.

## CLI

The simulator comes with a CLI to run any Mbed OS 5 project under the simulator.

**Running**

To run an Mbed OS 5 project:

```
$ mbed-simulator .
```

The project will build and a web browser window will open for you.

To see if your program runs in the simulator, check the `TARGET_SIMULATOR` macro.

**Running in headless mode**

You can also run the simulator in headless mode, which is great for automated testing. All output (through `printf` and traces) will be routed to your terminal. To run in headless mode, add the `--launch-headless` option. You might also want to limit the amount of logging the server does through `--disable-runtime-logs` to keep the output clean.

## Changing mbed-simulator-hal

After changing anything in the simulator HAL, you need to recompile the libmbed library:

1. Run:

    ```
    $ rm mbed-simulator-hal/libmbed.bc
    ```

1. Rebuild your application. libmbed will automatically be generated.