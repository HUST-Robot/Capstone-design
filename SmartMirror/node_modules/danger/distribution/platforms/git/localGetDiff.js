"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debug = require("debug");
var child_process_1 = require("child_process");
var d = debug("danger:localGetDiff");
exports.localGetDiff = function (base, head) {
    return new Promise(function (done) {
        var call = "git diff " + base + "..." + head;
        d(call);
        child_process_1.exec(call, function (err, stdout, _stderr) {
            if (err) {
                console.error("Could not get diff from git between " + base + " and " + head);
                console.error(err);
                return;
            }
            done(stdout);
        });
    });
};
//# sourceMappingURL=localGetDiff.js.map