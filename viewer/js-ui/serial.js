(function() {
    var terminal = new Terminal({
        scrollback: 1000000
    });
    terminal.open(document.querySelector('#output'));

    window.terminal = terminal;

    isError = false;
    error = "Error: \r\n";

    function displayError() {
        document.querySelector('#error-status').textContent = error;
    }

    function newLine(line) {
        if (isError) {
            error += "\r\n" + line;
            if (line.includes("SystemExit") || line.includes("Error") || line.includes("Exception")) {
                displayError();
                error = "Error: \r\n";
                isError = false;
            }
        }
        // Check everytime so that missed errors do not prevent future errors from being displayed.
        if (line.includes("Traceback (most recent call last):")) {
            isError = true;
            error = "Error: \r\n" + line;
        }
    }

    currentLine = "";

    window.MbedJSHal.serial.on('stdout', function(c) {
        if (typeof c === 'number') {
            c = String.fromCharCode(c);
        }
        // used to communicate back to Puppeteer (see cli.js)
        if (typeof window.onPrintEvent === 'function') {
            window.onPrintEvent(c);
        }

        // should be handled by Mbed OS, but it isn't...
        if (c === '\n') {
            terminal.write('\r');
            newLine(currentLine)
            currentLine = "";
        }
        else {
            currentLine += c;
        }

        terminal.write(c);
    });

    function stdin(e) {
        for (var i = 0; i < e.length; i++) {
          window.MbedJSHal.serial.onStdIn(e.charCodeAt(i));
        }
    }

    window.MbedJSHal.serial.on('stdout-line', function(l) {
        if (typeof window.onPrintEvent === 'function') {
            window.onPrintEvent(l);
        }

        terminal.write(l);
        newLine(l);
    });

    terminal.on('key', stdin);
})();
