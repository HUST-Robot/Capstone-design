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
Object.defineProperty(exports, "__esModule", { value: true });
var Dangerfile_1 = require("./Dangerfile");
var DangerDSL_1 = require("../dsl/DangerDSL");
var githubIssueTemplate_1 = require("./templates/githubIssueTemplate");
var exceptionRaisedTemplate_1 = require("./templates/exceptionRaisedTemplate");
var debug = require("debug");
var chalk_1 = require("chalk");
var DangerUtils_1 = require("./DangerUtils");
var jsonToDSL_1 = require("./jsonToDSL");
var dslGenerator_1 = require("./dslGenerator");
var Executor = /** @class */ (function () {
    function Executor(ciSource, platform, runner, options) {
        this.ciSource = ciSource;
        this.platform = platform;
        this.runner = runner;
        this.options = options;
        this.d = debug("danger:executor");
    }
    /** TODO: Next two functions aren't used in Danger, are they used in Peril? */
    /** Mainly just a dumb helper because I can't do
     * async functions in danger-run.js
     * @param {string} file the path to run Danger from
     * @returns {Promise<DangerResults>} The results of the Danger run
     */
    Executor.prototype.setupAndRunDanger = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var runtimeEnv;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setupDanger()];
                    case 1:
                        runtimeEnv = _a.sent();
                        return [4 /*yield*/, this.runDanger(file, runtimeEnv)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     *  Runs all of the operations for a running just Danger
     * @returns {DangerfileRuntimeEnv} A runtime environment to run Danger in
     */
    Executor.prototype.setupDanger = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dsl, realDSL, context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dslGenerator_1.jsonDSLGenerator(this.platform)];
                    case 1:
                        dsl = _a.sent();
                        return [4 /*yield*/, jsonToDSL_1.jsonToDSL(dsl)];
                    case 2:
                        realDSL = _a.sent();
                        context = Dangerfile_1.contextForDanger(realDSL);
                        return [4 /*yield*/, this.runner.createDangerfileRuntimeEnvironment(context)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     *  Runs all of the operations for a running just Danger
     * @param {string} file the filepath to the Dangerfile
     * @returns {Promise<DangerResults>} The results of the Danger run
     */
    Executor.prototype.runDanger = function (file, runtime) {
        return __awaiter(this, void 0, void 0, function () {
            var results, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.runner.runDangerfileEnvironment(file, undefined, runtime)];
                    case 2:
                        results = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        results = this.resultsForError(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [4 /*yield*/, this.handleResults(results)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, results];
                }
            });
        });
    };
    /**
     * Sets up all the related objects for running the Dangerfile
     * @returns {void} It's a promise, so a void promise
     */
    Executor.prototype.dslForDanger = function () {
        return __awaiter(this, void 0, void 0, function () {
            var git, platformDSL, utils;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.platform.getPlatformGitRepresentation()];
                    case 1:
                        git = _a.sent();
                        return [4 /*yield*/, this.platform.getPlatformDSLRepresentation()];
                    case 2:
                        platformDSL = _a.sent();
                        utils = { sentence: DangerUtils_1.sentence, href: DangerUtils_1.href };
                        return [2 /*return*/, new DangerDSL_1.DangerDSL(platformDSL, git, utils)];
                }
            });
        });
    };
    /**
     * Handle the message aspects of running a Dangerfile
     *
     * @param {DangerResults} results a JSON representation of the end-state for a Danger run
     */
    Executor.prototype.handleResults = function (results) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.d("Got Results back, current settings", this.options);
                if (this.options.stdoutOnly || this.options.jsonOnly) {
                    this.handleResultsPostingToSTDOUT(results);
                }
                else {
                    this.handleResultsPostingToPlatform(results);
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Handle showing results inside the shell.
     *
     * @param {DangerResults} results a JSON representation of the end-state for a Danger run
     */
    Executor.prototype.handleResultsPostingToSTDOUT = function (results) {
        return __awaiter(this, void 0, void 0, function () {
            var fails, warnings, messages, markdowns, results_1, table, s, are, message, message;
            return __generator(this, function (_a) {
                fails = results.fails, warnings = results.warnings, messages = results.messages, markdowns = results.markdowns;
                if (this.options.jsonOnly) {
                    results_1 = {
                        fails: fails,
                        warnings: warnings,
                        messages: messages,
                        markdowns: markdowns,
                    };
                    process.stdout.write(JSON.stringify(results_1, null, 2));
                }
                else {
                    this.d("Writing to STDOUT:", results);
                    table = [
                        fails.length && { name: "Failures", messages: fails.map(function (f) { return f.message; }) },
                        warnings.length && { name: "Warnings", messages: warnings.map(function (w) { return w.message; }) },
                        messages.length && { name: "Messages", messages: messages.map(function (m) { return m.message; }) },
                        markdowns.length && { name: "Markdowns", messages: markdowns },
                    ].filter(function (r) { return r !== 0; });
                    // Consider looking at getting the terminal width, and making it 60%
                    // if over a particular size
                    table.forEach(function (row) {
                        console.log("## " + chalk_1.default.bold(row.name));
                        console.log(row.messages.join(chalk_1.default.bold("\n-\n")));
                    });
                    if (fails.length > 0) {
                        s = fails.length === 1 ? "" : "s";
                        are = fails.length === 1 ? "is" : "are";
                        message = chalk_1.default.underline.red("Failing the build");
                        console.log("Danger: " + message + ", there " + are + " " + fails.length + " fail" + s + ".");
                        process.exitCode = 1;
                    }
                    else if (warnings.length > 0) {
                        message = chalk_1.default.underline("not failing the build");
                        console.log("Danger: Found only warnings, " + message);
                    }
                    else if (messages.length > 0) {
                        console.log("Danger: Passed, found only messages.");
                    }
                    else if (!messages.length && !fails.length && !messages.length && !warnings.length) {
                        console.log("Danger: Passed review, received no feedback.");
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Handle showing results inside a code review platform
     *
     * @param {DangerResults} results a JSON representation of the end-state for a Danger run
     */
    Executor.prototype.handleResultsPostingToPlatform = function (results) {
        return __awaiter(this, void 0, void 0, function () {
            var fails, warnings, messages, markdowns, failureCount, messageCount, dangerID, failed, successPosting, s, are, comment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fails = results.fails, warnings = results.warnings, messages = results.messages, markdowns = results.markdowns;
                        failureCount = fails.concat(warnings).length;
                        messageCount = messages.concat(markdowns).length;
                        this.d("Posting to platform:", results);
                        dangerID = this.options.dangerID;
                        failed = fails.length > 0;
                        return [4 /*yield*/, this.platform.updateStatus(!failed, messageForResults(results), this.ciSource.ciRunURL)];
                    case 1:
                        successPosting = _a.sent();
                        if (this.options.verbose) {
                            console.log("Could not add a commit status, the GitHub token for Danger does not have access rights.");
                            console.log("If the build fails, then danger will use a failing exit code.");
                        }
                        if (!(failureCount + messageCount === 0)) return [3 /*break*/, 3];
                        console.log("No issues or messages were sent. Removing any existing messages.");
                        return [4 /*yield*/, this.platform.deleteMainComment(dangerID)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        if (fails.length > 0) {
                            s = fails.length === 1 ? "" : "s";
                            are = fails.length === 1 ? "is" : "are";
                            console.log("Failing the build, there " + are + " " + fails.length + " fail" + s + ".");
                            if (!successPosting) {
                                this.d("Failing the build due to handleResultsPostingToPlatform not successfully setting a commit status");
                                process.exitCode = 1;
                            }
                        }
                        else if (warnings.length > 0) {
                            console.log("Found only warnings, not failing the build.");
                        }
                        else if (messageCount > 0) {
                            console.log("Found only messages, passing those to review.");
                        }
                        comment = githubIssueTemplate_1.template(dangerID, results);
                        return [4 /*yield*/, this.platform.updateOrCreateComment(dangerID, comment)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        if (!this.options.verbose) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.handleResultsPostingToSTDOUT(results)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Takes an error (maybe a bad eval) and provides a DangerResults compatible object
     * @param error Any JS error
     */
    Executor.prototype.resultsForError = function (error) {
        // Need a failing error, otherwise it won't fail CI.
        console.error(chalk_1.default.red("Danger has errored"));
        console.error(error);
        return {
            fails: [{ message: "Running your Dangerfile has Failed" }],
            warnings: [],
            messages: [],
            markdowns: [exceptionRaisedTemplate_1.default(error)],
        };
    };
    return Executor;
}());
exports.Executor = Executor;
var compliment = function () {
    var compliments = ["Well done.", "Congrats.", "Woo!", "Yay.", "Jolly good show.", "Good on 'ya.", "Nice work."];
    return compliments[Math.floor(Math.random() * compliments.length)];
};
var messageForResults = function (results) {
    if (!results.fails.length && !results.warnings.length) {
        return "All green. " + compliment();
    }
    else {
        return "⚠️ Danger found some issues. Don't worry, everything is fixable.";
    }
};
//# sourceMappingURL=Executor.js.map