"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var url = require("url");
var includes = require("lodash.includes");
function pullRequestParser(address) {
    var components = url.parse(address, false);
    if (components && components.path && includes(components.path, "pull")) {
        return {
            repo: components.path.split("/pull")[0].slice(1),
            pullRequestNumber: components.path.split("/pull/")[1],
        };
    }
    return null;
}
exports.pullRequestParser = pullRequestParser;
//# sourceMappingURL=pullRequestParser.js.map