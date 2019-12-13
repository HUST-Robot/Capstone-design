"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var vm2_1 = require("vm2");
var fs = require("fs");
var transpiler_1 = require("./utils/transpiler");
var cleanDangerfile_1 = require("./utils/cleanDangerfile");
var resultsForCaughtError_1 = require("./utils/resultsForCaughtError");
// A WIP version of the runner which uses a vm2 based in-process runner
// this has a few caveats ATM:
//
// * Relative files aren't getting transpiled
// * Babel sometime with async functions in the runtime
function createDangerfileRuntimeEnvironment(dangerfileContext) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // This is for plugin support, we now have the Danger objects inside Danger's
            // main process context too. This means plugins that Danger depends on can also
            // get support for the globals.
            Object.keys(dangerfileContext).forEach(function (key) {
                global[key] = dangerfileContext[key];
            });
            return [2 /*return*/, {
                    require: {
                        external: true,
                        context: "host",
                        builtin: ["*"],
                    },
                    sandbox: __assign({}, dangerfileContext, { regeneratorRuntime: regeneratorRuntime }),
                    compiler: transpiler_1.default,
                }];
        });
    });
}
exports.createDangerfileRuntimeEnvironment = createDangerfileRuntimeEnvironment;
function runDangerfileEnvironment(filename, originalContents, environment) {
    return __awaiter(this, void 0, void 0, function () {
        var vm, content, results, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vm = new vm2_1.NodeVM(environment);
                    // Require our dangerfile
                    originalContents = originalContents || fs.readFileSync(filename, "utf8");
                    content = cleanDangerfile_1.default(originalContents);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    vm.run(content, filename);
                    results = environment.sandbox.results;
                    return [4 /*yield*/, Promise.all(results.scheduled.map(function (fnOrPromise) {
                            if (fnOrPromise instanceof Promise) {
                                return fnOrPromise;
                            }
                            if (fnOrPromise.length === 1) {
                                // callback-based function
                                return new Promise(function (res) { return fnOrPromise(res); });
                            }
                            return fnOrPromise();
                        }))];
                case 2:
                    _a.sent();
                    return [2 /*return*/, {
                            fails: results.fails,
                            warnings: results.warnings,
                            messages: results.messages,
                            markdowns: results.markdowns,
                        }];
                case 3:
                    error_1 = _a.sent();
                    console.error("Unable to evaluate the Dangerfile");
                    return [2 /*return*/, resultsForCaughtError_1.default(filename, content, error_1)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.runDangerfileEnvironment = runDangerfileEnvironment;
var defaultExport = {
    createDangerfileRuntimeEnvironment: createDangerfileRuntimeEnvironment,
    runDangerfileEnvironment: runDangerfileEnvironment,
};
exports.default = defaultExport;
//# sourceMappingURL=vm2.js.map