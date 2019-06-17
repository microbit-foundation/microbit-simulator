(function() {
    var Module = {
        preRun: [
            function() {
                addRunDependency('IDBFS');
                FS.mkdir('/IDBFS');
                FS.mount(IDBFS, {}, '/IDBFS');

                FS.syncfs(true, function (err) {
                    if (err) {
                        console.error('Could not sync /IDBFS', err);
                    }
                    else {
                        console.log('Synced /IDBFS');
                    }
                    removeRunDependency('IDBFS');
                });
            },
            function() {
                if (typeof window.onStartExecution === 'function') {
                    window.onStartExecution();
                }
            }
        ],
        postRun: [],
        print: function () {
            for (var ix = 0; ix < arguments.length; ix++) {
                var line = arguments[ix];

                window.MbedJSHal.serial.writeLine(line + '\r\n');
            }
        },
        printErr: function () {
            for (var ix = 0; ix < arguments.length; ix++) {
                // terminal.write(arguments[ix]);
                console.error(arguments[ix]);
            }
        },
        setStatus: function (text) {
            var statusElement = document.querySelector('#status');
            if (!Module.setStatus.last) Module.setStatus.last = {
                time: Date.now(),
                text: ''
            };
            if (text === Module.setStatus.text) return;
            var m = text.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
            var now = Date.now();
            if (m && now - Date.now() < 30) return; // if this is a progress update, skip it if too soon
            if (m) {
                text = m[1];
            }
            statusElement.textContent = text;
        },
        totalDependencies: 0,
        monitorRunDependencies: function (left) {
            this.totalDependencies = Math.max(this.totalDependencies, left);
            Module.setStatus(left ? 'Preparing... (' + (this.totalDependencies - left) + '/' + this.totalDependencies + ')' : 'All downloads complete.');
        }
    };
    Module.setStatus('Downloading...');

    window.onerror = function (message) {
        // TODO: do not warn on ok events like simulating an infinite loop or exitStatus
        Module.setStatus('Exception thrown, see JavaScript console');
        Module.setStatus = function (text) {
            if (text) Module.printErr('[post-exception status] ' + text);
        };
        if (typeof window.onFailedExecution === 'function') {
            window.onFailedExecution(message);
        }
    };

    window.MbedJSHal = {
        die: function () {
            Module.setStatus('Board has died');
            Module.printErr('[post-exception status] mbed_die() was called');
            if (typeof window.onFailedExecution === 'function') {
                window.onFailedExecution('Board has died');
            }
        },
        syncIdbfs: function() {
            FS.syncfs(false, function (err) {
                if (err) {
                    console.error('Could not sync /IDBFS');
                }
                else {
                    console.log('Synced /IDBFS');
                }
            });
        },
        clearIdbfs: function() {
            function rmRecursive(path) {
                FS.readdir(path).forEach(function(item) {
                    if (item === '.' || item === '..') return;

                    item = path + '/' + item;

                    console.log('reading', item, FS.stat(item).mode)

                    if ((FS.stat(item).mode & 00170000) === 0040000) {
                        console.log(item, 'is directory, gonna remove');
                        rmRecursive(item);
                        FS.rmdir(item);
                    }
                    else {
                        console.log('unlink', item);
                        FS.unlink(item);
                    }
                });
            }

            rmRecursive('/IDBFS');

            window.MbedJSHal.syncIdbfs();
        }
    };

    window.MbedJSUI = {};

    window.MbedJSUI.MicroPythonTests =
       ['arrayop-1-list',
        'arrayop-2-list',
        'arrayop-3',
        'arrayop-4',
        'bytealloc-1',
        'bytealloc-2',
        'bytebuf-1',
        'bytebuf-2',
        'bytebuf-3',
        'from_iter-1',
        'from_iter-2',
        'from_iter-3',
        'from_iter-4',
        'from_iter-5',
        'from_iter-6',
        'from_iter-7',
        'from_iter-8',
        'funcall-1',
        'funcall-2',
        'funcall-3',
        'func-args-1',
        'func-args-2',
        'func-args-3',
        'func-args-4',
        'func-args-5',
        'func_builtin-1',
        'func_builtin-2',
        'heap_lock',
        'loop_count-1',
        'loop_count-2',
        'loop_count-3',
        'loop_count-4',
        'loop_count-5',
        'loop_count-6',
        'radio_audio.py ',
        'test_files',
        'test_files2',
        'test_files3',
        'test_image',
        'test_music',
        'test_pins',
        'test_pwm',
        'test_random',
        'test_speech',
        'var-1',
        'var-2',
        'var-3',
        'var-4',
        'var-5',
        'var-6',
        'var-7',
        'var-8',
        'var-9',
        'var-10'];

    window.Module = Module;
})();
