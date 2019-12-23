import { GitCommit } from "../../dsl/Commit";
/**
 * This function is essentially a "go from a diff to some simple structured data"
 * it's the steps needed for danger process.
 */
export declare const diffToGitJSONDSL: (diff: string, commits: GitCommit[]) => {
    modified_files: any[];
    created_files: any[];
    deleted_files: any[];
    commits: GitCommit[];
};
