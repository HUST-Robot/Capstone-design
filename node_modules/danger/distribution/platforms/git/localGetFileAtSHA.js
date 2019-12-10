"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debug = require("debug");
var child_process_1 = require("child_process");
var d = debug("danger:localGetFileAtSHA");
exports.localGetFileAtSHA = function (path, _repo, sha) {
    return new Promise(function (done) {
        var call = "git show " + sha + ":\"" + path + "\"";
        d(call);
        child_process_1.exec(call, function (err, stdout, _stderr) {
            if (err) {
                console.error("Could not get the file " + path + " from git at " + sha);
                console.error(err);
                return;
            }
            done(stdout);
        });
    });
};
//# sourceMappingURL=localGetFileAtSHA.js.map