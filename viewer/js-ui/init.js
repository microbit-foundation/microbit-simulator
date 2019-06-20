(function() {
    var Module = {
        preRun: [
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
        }
    };

    window.MbedJSUI = {};

    window.MbedJSUI.MicroPythonCrashesHardware = [
        'basics/bytes',
        'basics/class_staticclassmethod',
        'basics/fun_error2',
        'basics/gen_yield_from_executing',
        'basics/gen_yield_from_throw2',
        'basics/gen_yield_from_throw3',
        'basics/string_endswith',
        'basics/string_find',
        'basics/string_startswith',
        'basics/try_finally_break'
        ];

    window.MbedJSUI.MicroPythonTestList = [
        'basics/builtin_divmod_intbig',
        'basics/builtin_type',
        'basics/bytearray_construct',
        'basics/bytes_construct',
        'basics/bytes_split',
        'basics/class_store_class',
        'basics/containment',
        'basics/dict_from_iter',
        'basics/fun_calldblstar',
        'basics/fun_defargs',
        'basics/fun_error',
        'basics/fun_kwargs',
        'basics/fun_kwonly',
        'basics/gen_yield_from_ducktype',
        'basics/int_big_error',
        'basics/iter1',
        'basics/memoryerror',
        'basics/set_add',
        'basics/set_binop',
        'basics/set_clear',
        'basics/set_copy',
        'basics/set_discard',
        'basics/set_intersection',
        'basics/set_pop',
        'basics/set_remove',
        'basics/set_symmetric_difference',
        'basics/set_update',
        'basics/string_format_error',
        'basics/string_format_modulo',
        'basics/string_join',
        'basics/string_rsplit',
        'basics/string_split',
        'basics/struct1_intbig',
        'basics/struct1',
        'basics/struct2',
        'basics/struct_micropython',
        'basics/syntaxerror',
        'basics/unpack1',
        'microbit/test_files3',
        ];

    window.Module = Module;
})();
