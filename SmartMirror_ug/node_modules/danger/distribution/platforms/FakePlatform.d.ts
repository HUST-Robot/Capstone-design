import { GitDSL } from "../dsl/GitDSL";
import { CISource } from "../ci_source/ci_source";
import { Platform } from "./platform";
export declare class FakePlatform implements Platform {
    readonly name: string;
    readonly ciSource: CISource;
    constructor();
    getPlatformDSLRepresentation(): Promise<any>;
    getPlatformGitRepresentation(): Promise<GitDSL>;
    supportsCommenting(): boolean;
    updateOrCreateComment(_newComment: string): Promise<boolean>;
    createComment(_comment: string): Promise<any>;
    deleteMainComment(): Promise<boolean>;
    updateStatus(_success: boolean, _message: string): Promise<boolean>;
    getFileContents: (path: string) => Promise<string>;
}
