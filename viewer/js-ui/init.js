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

    window.broadcastSimulatorMessage = function(simwindow, packet) {
        console.log(packet);
        console.log(packet.payload_string);
    }

    window.closeSimulator = function(simwindow) {
        window.MbedJSUI.reset();
    }

    window.getSimulatorScript = function(simwindow) {
        return window.document.getElementById("script").value;
    }

    window.getSimulatorFileSystemSize = function(simwindow) {
        // Will get saturated to max size.
        return 1000000;
    }

    window.initialiseSimulator = function(simwindow) {}

    window.MbedJSUI = {};

    window.MbedJSUI.simulator_id = Math.floor(Math.random() * 10000000000000000);

    window.MbedJSUI.initialise = function () {
        document.querySelector('#error-status').textContent = "";
        window.MbedJSUI.MicrobitDisplay.prototype.clear();
        ccall('set_filesystem_size', 'null', ['number'], [window.parent.getSimulatorFileSystemSize(window)]);
        ccall('set_script', 'null',['string'], [window.parent.getSimulatorScript(window)]);
        window.MbedJSUI.MicrobitDisplay.prototype.micropython_mode(true);
        window.MbedJSUI.ready = true;
        window.parent.initialiseSimulator(window);
    }

    window.MbedJSUI.reset = function() {
        if (window.MbedJSUI.ready) {
             ccall('reset_device', 'null');
         }
    }

    window.MbedJSUI.write_file = function(fileName, bytes) {
        if (window.MbedJSUI.ready) {
            ccall('write_file', 'null',['string', 'array', 'number'], [fileName, bytes, bytes.length]);
        }
    }

    window.MbedJSUI.MicroPythonCrashesHardware = [
        // 'basics/builtin_type'
        // 'basics/bytes',
        // 'basics/fun_error2',
        // 'basics/gen_yield_from_executing',
        // 'basics/gen_yield_from_throw2',
        // 'basics/gen_yield_from_throw3',
        // 'basics/string_endswith',
        // 'basics/string_find',
        // 'basics/string_startswith',
        // 'basics/try_finally_break',
        ];

    window.MbedJSUI.MicroPythonTestList = [
        'basics/0prelim',
        'basics/andor',
        'basics/array1',
        'basics/array_add',
        'basics/array_construct2',
        'basics/array_construct_endian',
        'basics/array_construct',
        'basics/array_intbig',
        'basics/array_micropython',
        'basics/assign1',
        'basics/attrtuple1',
        'basics/bool1',
        'basics/boundmeth1',
        'basics/break',
        'basics/builtin_abs_intbig',
        'basics/builtin_abs',
        'basics/builtin_allany',
        'basics/builtin_bin_intbig',
        'basics/builtin_bin',
        'basics/builtin_callable',
        'basics/builtin_chr',
        'basics/builtin_dir',
        'basics/builtin_divmod_intbig',
        'basics/builtin_divmod',
        'basics/builtin_ellipsis',
        'basics/builtin_enumerate',
        'basics/builtin_eval_error',
        'basics/builtin_eval',
        'basics/builtin_exec',
        'basics/builtin_filter',
        'basics/builtin_getattr',
        'basics/builtin_hasattr',
        'basics/builtin_hash_gen',
        'basics/builtin_hash_intbig',
        'basics/builtin_hash',
        'basics/builtin_help',
        'basics/builtin_hex_intbig',
        'basics/builtin_hex',
        'basics/builtin_id',
        'basics/builtin_issubclass',
        'basics/builtin_len1',
        'basics/builtin_locals',
        'basics/builtin_map',
        'basics/builtin_minmax',
        'basics/builtin_oct_intbig',
        'basics/builtin_oct',
        'basics/builtin_ord',
        'basics/builtin_override',
        'basics/builtin_pow',
        'basics/builtin_print',
        'basics/builtin_range_attrs',
        'basics/builtin_range',
        'basics/builtin_reversed',
        'basics/builtin_round_intbig',
        'basics/builtin_round_int',
        'basics/builtin_round',
        'basics/builtin_setattr',
        'basics/builtin_slice',
        'basics/builtin_sorted',
        'basics/builtin_sum',
        'basics/builtin_type',
        'basics/builtin_zip',
        'basics/bytearray1',
        'basics/bytearray_add',
        'basics/bytearray_append',
        'basics/bytearray_construct_array',
        'basics/bytearray_construct_endian',
        'basics/bytearray_construct',
        'basics/bytearray_intbig',
        'basics/bytes_add_array',
        'basics/bytes_add_endian',
        'basics/bytes_add',
        'basics/bytes_compare2',
        'basics/bytes_compare3',
        'basics/bytes_compare_array',
        'basics/bytes_compare',
        'basics/bytes_construct_array',
        'basics/bytes_construct_endian',
        'basics/bytes_construct_intbig',
        'basics/bytes_construct',
        'basics/bytes_count',
        'basics/bytes_find',
        'basics/bytes_format_modulo',
        'basics/bytes_gen',
        'basics/bytes_large',
        'basics/bytes_mult',
        'basics/bytes',
        'basics/bytes_replace',
        'basics/bytes_split',
        'basics/bytes_strip',
        'basics/bytes_subscr',
        'basics/class1',
        'basics/class2',
        'basics/class3',
        'basics/class_bind_self',
        'basics/class_binop',
        'basics/class_call',
        'basics/class_contains',
        'basics/class_emptybases',
        'basics/class_getattr',
        'basics/class_inherit1',
        'basics/class_inherit_mul',
        'basics/class_instance_override',
        'basics/class_item',
        'basics/class_misc',
        'basics/class_number',
        'basics/class_reverse_op',
        'basics/class_store_class',
        'basics/class_store',
        'basics/class_str',
        'basics/class_super_aslocal',
        'basics/class_super_closure',
        'basics/class_super_multinherit',
        'basics/class_use_other',
        'basics/closure1',
        'basics/closure2',
        'basics/closure_defargs',
        'basics/closure_manyvars',
        'basics/closure_namedarg',
        'basics/compare_multi',
        'basics/comprehension1',
        'basics/containment',
        'basics/continue',
        'basics/decorator',
        'basics/del_attr',
        'basics/del_deref',
        'basics/del_global',
        'basics/del_local',
        'basics/del_name',
        'basics/del_subscr',
        'basics/dict1',
        'basics/dict2',
        'basics/dict_clear',
        'basics/dict_construct',
        'basics/dict_copy',
        'basics/dict_del',
        'basics/dict_from_iter',
        'basics/dict_fromkeys2',
        'basics/dict_fromkeys',
        'basics/dict_get',
        'basics/dict_intern',
        'basics/dict_iterator',
        'basics/dict_popitem',
        'basics/dict_pop',
        'basics/dict_setdefault',
        'basics/dict_specialmeth',
        'basics/dict_update',
        'basics/dict_views',
        'basics/equal_class',
        'basics/equal',
        'basics/exception1',
        'basics/exception_chain',
        'basics/exceptpoly2',
        'basics/exceptpoly',
        'basics/floordivide_intbig',
        'basics/floordivide',
        'basics/for1',
        'basics/for2',
        'basics/for3',
        'basics/for_break',
        'basics/for_else',
        'basics/for_range',
        'basics/for_return',
        'basics/frozenset1',
        'basics/frozenset_add',
        'basics/frozenset_binop',
        'basics/frozenset_copy',
        'basics/frozenset_difference',
        'basics/frozenset_set',
        'basics/fun1',
        'basics/fun2',
        'basics/fun3',
        'basics/fun_annotations',
        'basics/fun_calldblstar2',
        'basics/fun_calldblstar3',
        'basics/fun_calldblstar',
        'basics/fun_callstardblstar',
        'basics/fun_callstar',
        'basics/fun_defargs2',
        'basics/fun_defargs',
        'basics/fun_error2',
        'basics/fun_error',
        'basics/fun_kwargs',
        'basics/fun_kwonlydef',
        'basics/fun_kwonly',
        'basics/fun_kwvarargs',
        'basics/fun_largestate',
        'basics/fun_str',
        'basics/fun_varargs',
        'basics/gc1',
        'basics/generator1',
        'basics/generator2',
        'basics/generator_args',
        'basics/generator_close',
        'basics/generator_closure',
        'basics/generator_exc',
        'basics/generator_pep479',
        'basics/generator_return',
        'basics/generator_send',
        'basics/generator_throw',
        'basics/gen_yield_from_close',
        'basics/gen_yield_from_ducktype',
        'basics/gen_yield_from_exc',
        'basics/gen_yield_from_executing',
        'basics/gen_yield_from_iter',
        'basics/gen_yield_from',
        'basics/gen_yield_from_send',
        'basics/gen_yield_from_stopped',
        'basics/gen_yield_from_throw2',
        'basics/gen_yield_from_throw3',
        'basics/gen_yield_from_throw',
        'basics/getattr',
        'basics/getitem',
        'basics/globals_del',
        'basics/ifcond',
        'basics/ifexpr',
        'basics/int1',
        'basics/int2',
        'basics/int_big1',
        'basics/int_big_add',
        'basics/int_big_and2',
        'basics/int_big_and3',
        'basics/int_big_and',
        'basics/int_big_cmp',
        'basics/int_big_div',
        'basics/int_big_error',
        'basics/int_big_lshift',
        'basics/int_big_mod',
        'basics/int_big_mul',
        'basics/int_big_or2',
        'basics/int_big_or3',
        'basics/int_big_or',
        'basics/int_big_pow',
        'basics/int_big_rshift',
        'basics/int_big_unary',
        'basics/int_big_xor2',
        'basics/int_big_xor3',
        'basics/int_big_xor',
        'basics/int_big_zeroone',
        'basics/int_bytes_intbig',
        'basics/int_bytes',
        'basics/int_constfolding_intbig',
        'basics/int_constfolding',
        'basics/int_divmod_intbig',
        'basics/int_divmod',
        'basics/int_divzero',
        'basics/int_intbig',
        'basics/int_small',
        'basics/is_isnot',
        'basics/iter0',
        'basics/iter1',
        'basics/iter2',
        'basics/iter_of_iter',
        'basics/lambda1',
        'basics/lambda_defargs',
        'basics/lexer',
        'basics/list1',
        'basics/list_clear',
        'basics/list_compare',
        'basics/list_copy',
        'basics/list_count',
        'basics/list_extend',
        'basics/list_index',
        'basics/list_insert',
        'basics/list_mult',
        'basics/list_pop',
        'basics/list_remove',
        'basics/list_reverse',
        'basics/list_slice_3arg',
        'basics/list_slice_assign_grow',
        'basics/list_slice_assign',
        'basics/list_slice',
        'basics/list_sort',
        'basics/list_sum',
        'basics/logic_constfolding',
        'basics/memoryerror',
        'basics/module1',
        'basics/module2',
        'basics/namedtuple1',
        'basics/object1',
        'basics/op_error_intbig',
        'basics/op_error',
        'basics/op_precedence',
        'basics/ordereddict1',
        'basics/ordereddict_eq',
        'basics/python34',
        'basics/return1',
        'basics/scope',
        'basics/self_type_check',
        'basics/seq_unpack',
        'basics/set_add',
        'basics/set_basic',
        'basics/set_binop',
        'basics/set_clear',
        'basics/set_comprehension',
        'basics/set_containment',
        'basics/set_copy',
        'basics/set_difference',
        'basics/set_discard',
        'basics/set_intersection',
        'basics/set_isdisjoint',
        'basics/set_isfooset',
        'basics/set_iter_of_iter',
        'basics/set_iter',
        'basics/set_pop',
        'basics/set_remove',
        'basics/set_specialmeth',
        'basics/set_symmetric_difference',
        'basics/set_type',
        'basics/set_union',
        'basics/set_unop',
        'basics/set_update',
        'basics/slice_intbig',
        'basics/slots_bool_len',
        'basics/string1',
        'basics/string_compare',
        'basics/string_count',
        'basics/string_cr_conversion',
        'basics/string_crlf_conversion',
        'basics/string_endswith',
        'basics/string_endswith_upy',
        'basics/string_escape',
        'basics/string_find',
        'basics/string_format2',
        'basics/string_format_error',
        'basics/string_format_modulo_int',
        'basics/string_format_modulo',
        'basics/string_format',
        'basics/string_index',
        'basics/string_istest',
        'basics/string_join',
        'basics/string_large',
        'basics/string_mult',
        'basics/string_replace',
        'basics/string_repr',
        'basics/string_rfind',
        'basics/string_rindex',
        'basics/string_rsplit',
        'basics/string_slice',
        'basics/string_split',
        'basics/string_startswith',
        'basics/string_startswith_upy',
        'basics/string_strip',
        'basics/string_upperlow',
        'basics/struct1_intbig',
        'basics/struct1',
        'basics/struct2',
        'basics/struct_micropython',
        'basics/subclass_native1',
        'basics/subclass_native2_list',
        'basics/subclass_native2_tuple',
        'basics/subclass_native3',
        'basics/subclass_native4',
        'basics/subclass_native5',
        'basics/subclass_native_buffer',
        'basics/subclass_native_cmp',
        'basics/subclass_native_iter',
        'basics/subclass_native_specmeth',
        'basics/syntaxerror',
        'basics/true_value',
        'basics/try1',
        'basics/try2',
        'basics/try3',
        'basics/try4',
        'basics/try_as_var',
        'basics/try_continue',
        'basics/try_else_finally',
        'basics/try_else',
        'basics/try_error',
        'basics/try_finally1',
        'basics/try_finally2',
        'basics/try_finally_break',
        'basics/try_finally_loops',
        'basics/try_finally_return2',
        'basics/try_finally_return3',
        'basics/try_finally_return4',
        'basics/try_finally_return',
        'basics/try_reraise2',
        'basics/try_reraise',
        'basics/try_return',
        'basics/tuple1',
        'basics/tuple_compare',
        'basics/tuple_count',
        'basics/tuple_index',
        'basics/tuple_mult',
        'basics/types1',
        'basics/types2',
        'basics/unary_op',
        'basics/unboundlocal',
        'basics/unpack1',
        'basics/while1',
        'basics/while_cond',
        'basics/while_nest_exc',
        'basics/with1',
        'basics/with_break',
        'basics/with_continue',
        'basics/with_raise',
        'basics/with_return',
        'bench/arrayop-1-list',
        'bench/arrayop-3',
        'bench/arrayop-4',
        'bench/bytebuf-1',
        'bench/bytebuf-3',
        'bench/funcall-1',
        'bench/funcall-2',
        'bench/funcall-3',
        'bench/func-args-1',
        'bench/func-args-2',
        'bench/func-args-3',
        'bench/func-args-4',
        'bench/func-args-5',
        'bench/func_builtin-1',
        'bench/func_builtin-2',
        'bench/loop_count-1',
        'bench/loop_count-2',
        'bench/loop_count-3',
        'bench/loop_count-4',
        'bench/loop_count-5',
        'bench/loop_count-6',
        'bench/var-1',
        'bench/var-2',
        'bench/var-3',
        'bench/var-4',
        'bench/var-5',
        'bench/var-6',
        'bench/var-7',
        'bench/var-8',
        'bench/var-9',
        'bench/var-10',
        'microbit/test_files',
        'microbit/test_files2',
        'microbit/test_files3',
        'microbit/test_image',
        'microbit/test_random'];

    window.MbedJSUI.MicroPythonTestList = window.MbedJSUI.MicroPythonTestList.filter(function(x) { return !window.MbedJSUI.MicroPythonCrashesHardware.includes(x); });

    window.Module = Module;
})();
