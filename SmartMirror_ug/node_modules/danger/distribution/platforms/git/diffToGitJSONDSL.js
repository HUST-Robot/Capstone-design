"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parseDiff = require("parse-diff");
var lodash_1 = require("lodash");
/**
 * This function is essentially a "go from a diff to some simple structured data"
 * it's the steps needed for danger process.
 */
exports.diffToGitJSONDSL = function (diff, commits) {
    var fileDiffs = parseDiff(diff);
    var addedDiffs = fileDiffs.filter(function (diff) { return diff["new"]; });
    var removedDiffs = fileDiffs.filter(function (diff) { return diff["deleted"]; });
    var modifiedDiffs = fileDiffs.filter(function (diff) { return !lodash_1.includes(addedDiffs, diff) && !lodash_1.includes(removedDiffs, diff); });
    return {
        modified_files: modifiedDiffs.map(function (d) { return d.to; }),
        created_files: addedDiffs.map(function (d) { return d.to; }),
        deleted_files: removedDiffs.map(function (d) { return d.from; }),
        commits: commits,
    };
};
//# sourceMappingURL=diffToGitJSONDSL.js.map