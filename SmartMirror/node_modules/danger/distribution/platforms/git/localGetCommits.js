"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var debug = require("debug");
var JSON5 = require("json5");
var child_process_1 = require("child_process");
var d = debug("danger:localGetDiff");
var sha = "%H";
var parents = "%p";
var authorName = "%an";
var authorEmail = "%ae";
var authorDate = "%ai";
var committerName = "%cn";
var committerEmail = "%ce";
var committerDate = "%ci";
var message = "%s"; // this is subject, not message, so it'll only be one line
var author = "\"author\": {\"name\": \"" + authorName + "\", \"email\": \"" + authorEmail + "\", \"date\": \"" + authorDate + "\" }";
var committer = "\"committer\": {\"name\": \"" + committerName + "\", \"email\": \"" + committerEmail + "\", \"date\": \"" + committerDate + "\" }";
exports.formatJSON = "{ \"sha\": \"" + sha + "\", \"parents\": \"" + parents + "\", " + author + ", " + committer + ", \"message\": \"" + message + "\"},";
exports.localGetCommits = function (base, head) {
    return new Promise(function (done) {
        var call = "git log " + base + "..." + head + " --pretty=format:'" + exports.formatJSON + "'";
        d(call);
        child_process_1.exec(call, function (err, stdout, _stderr) {
            if (err) {
                console.error("Could not get commits from git between " + base + " and " + head);
                console.error(err);
                return;
            }
            // remove trailing comma, and wrap into an array
            var asJSONString = "[" + stdout.substring(0, stdout.length - 1) + "]";
            var commits = JSON5.parse(asJSONString);
            var realCommits = commits.map(function (c) { return (__assign({}, c, { parents: c.parents.split(" ") })); });
            done(realCommits);
        });
    });
};
//# sourceMappingURL=localGetCommits.js.map