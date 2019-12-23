"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// End of Danger DSL definition
var DangerDSL = /** @class */ (function () {
    function DangerDSL(platformDSL, git, utils) {
        this.git = git;
        this.utils = utils;
        // As GitLab etc support is added this will need to be changed
        this.github = platformDSL;
    }
    return DangerDSL;
}());
exports.DangerDSL = DangerDSL;
//# sourceMappingURL=DangerDSL.js.map