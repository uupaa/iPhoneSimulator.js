#!/usr/bin/env node

(function(global) {

var USAGE = _multiline(function() {/*
    Usage:
        node bin/iPhoneSimulator.js [--help]
                                    [--verbose]
                                    [--port port-number]
                                    [--open absolute-url-or-relative-path]

    See:
        https://github.com/uupaa/iPhoneSimulator.js/wiki/iPhoneSimulator.js
*/});


var CONSOLE_COLOR = {
        RED:    "\u001b[31m",
        YELLOW: "\u001b[33m",
        GREEN:  "\u001b[32m",
        CLEAR:  "\u001b[0m"
    };

var Process = require("child_process");

var argv    = process.argv.slice(2);
var options = _parseCommandLineOptions({
        help:       false,      // Boolean: true is show help.
        verbose:    false,      // Boolean: true is verbose mode.
        port:       8585,       // URLString: port number.
        open:       ""          // URLString: url or path.
    });

if (options.help) {
    console.log(CONSOLE_COLOR.YELLOW + USAGE + CONSOLE_COLOR.CLEAR);
    return;
}

if (options.verbose) {
}

if (options.open) {
    Process.exec("http-server -p " + options.port, function(err, stdout, stderr) { });

    var findCommand = "find /Applications/Xcode.app/Contents/Developer/Platforms/iPhoneSimulator.platform/Developer/SDKs -name MobileSafari.app"

    Process.exec(findCommand, function(err, stdout, stderr) {
        // /Applications/Xcode.app/Contents/Developer/Platforms/iPhoneSimulator.platform/Developer/SDKs/iPhoneSimulator7.1.sdk/Applications/MobileSafari.app
        var path = stdout.trim() + "/MobileSafari";

        var openCommand =
                "/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneSimulator.platform/Developer/Applications/iPhone\\ Simulator.app/Contents/MacOS/iPhone\\ Simulator" +
                " -SimulateApplication" +
             // " /Applications/Xcode.app/Contents/Developer/Platforms/iPhoneSimulator.platform/Developer/SDKs/iPhoneSimulator7.1.sdk/Applications/MobileSafari.app/MobileSafari" +
                " " + path +
                " -u " + options.open;

        // console.log(openCommand);

        Process.exec(openCommand, function(err, stdout, stderr) { });
    });
}

function _parseCommandLineOptions(options) { // @arg Object:
                                             // @ret Object:
    for (var i = 0, iz = argv.length; i < iz; ++i) {
        switch (argv[i]) {
        case "-h":
        case "--help":      options.help = true; break;
        case "-v":
        case "--verbose":   options.verbose = true; break;
        case "--port":      options.port = argv[++i]; break;
        case "--open":      options.open = argv[++i];
        }
    }
    if (options.open) {
        if (!/^http/.test(options.open)) {
            options.open = "http://localhost:" + options.port + "/" + options.open;
        }
    }
    return options;
}

function _multiline(fn) { // @arg Function:
                          // @ret String:
    return (fn + "").split("\n").slice(1, -1).join("\n");
}

})((this || 0).self || global);

