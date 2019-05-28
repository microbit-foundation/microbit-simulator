// C calling interface.
function ccall(ident, returnType, argTypes, args, opts) {
  function convertReturnValue(ret) {
    if (returnType === 'string') return Pointer_stringify(ret);
    if (returnType === 'boolean') return Boolean(ret);
    return ret;
  }

  var func = getCFunc(ident);
  var cArgs = [];
  var stack = 0;
#if ASSERTIONS
  assert(returnType !== 'array', 'Return type should not be "array".');
#endif
  if (args) {
    for (var i = 0; i < args.length; i++) {
      var converter = toC[argTypes[i]];
      if (converter) {
        if (stack === 0) stack = stackSave();
        cArgs[i] = converter(args[i]);
      } else {
        cArgs[i] = args[i];
      }
    }
  }
  var ret = func.apply(null, cArgs);
// #if EMTERPRETIFY_ASYNC
//   if (typeof EmterpreterAsync === 'object' && EmterpreterAsync.state) {
// #if ASSERTIONS
//     assert(opts && opts.async, 'The call to ' + ident + ' is running asynchronously. If this was intended, add the async option to the ccall/cwrap call.');
//     assert(!EmterpreterAsync.restartFunc, 'Cannot have multiple async ccalls in flight at once');
// #endif
//     return new Promise(function(resolve) {
//       EmterpreterAsync.restartFunc = func;
//       EmterpreterAsync.asyncFinalizers.push(function(ret) {
//         if (stack !== 0) stackRestore(stack);
//         resolve(convertReturnValue(ret));
//       });
//     });
//   }
// #endif
  ret = convertReturnValue(ret);
  if (stack !== 0) stackRestore(stack);
// #if EMTERPRETIFY_ASYNC
//   // If this is an async ccall, ensure we return a promise
//   if (opts && opts.async) return Promise.resolve(ret);
// #endif
return ret;
}