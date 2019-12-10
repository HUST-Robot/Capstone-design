"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var DangerUtils_1 = require("../../runner/DangerUtils");
// We need to curry in access to the GitHub PR metadata
var utils = function (pr, api) {
    /**
     * Converts a set of filepaths into a sentence'd set of hrefs for the
     * current PR. Can be configured to just show the name (instead of full filepath), to
     * change the github repo or branch.
     *
     */
    var fileLinks = function (paths, useBasename, repoSlug, branch) {
        // To support enterprise github, we need to handle custom github domains
        // this can be pulled out of the repo url metadata
        if (useBasename === void 0) { useBasename = true; }
        var githubRoot = pr.head.repo.html_url.split(pr.head.repo.owner.login)[0];
        var slug = repoSlug || pr.head.repo.full_name;
        var ref = branch || pr.head.ref;
        var toHref = function (path) { return "" + githubRoot + slug + "/blob/" + ref + "/" + path; };
        // As we should only be getting paths we can ignore the nullability
        var hrefs = paths.map(function (p) { return DangerUtils_1.href(toHref(p), useBasename ? path_1.basename(p) : p); });
        return DangerUtils_1.sentence(hrefs);
    };
    return {
        fileLinks: fileLinks,
        fileContents: function (path, repoSlug, ref) { return __awaiter(_this, void 0, void 0, function () {
            var opts, response, buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Use the current state of PR if no repo/ref is passed
                        if (!repoSlug || !ref) {
                            repoSlug = pr.head.repo.full_name;
                            ref = pr.head.ref;
                        }
                        opts = {
                            ref: ref,
                            path: path,
                            repo: repoSlug.split("/")[1],
                            owner: repoSlug.split("/")[0],
                        };
                        return [4 /*yield*/, api.repos.getContent(opts)];
                    case 1:
                        response = _a.sent();
                        if (response && response.data && response.data.type === "file") {
                            buffer = new Buffer(response.data.content, response.data.encoding);
                            return [2 /*return*/, buffer.toString()];
                        }
                        else {
                            return [2 /*return*/, ""];
                        }
                        return [2 /*return*/];
                }
            });
        }); },
    };
};
exports.default = utils;
//# sourceMappingURL=GitHubUtils.js.map