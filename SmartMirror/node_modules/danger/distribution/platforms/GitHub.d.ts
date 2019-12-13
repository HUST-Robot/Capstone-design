import { GitJSONDSL } from "../dsl/GitDSL";
import { GitHubPRDSL, GitHubDSL, GitHubIssue, GitHubAPIPR, GitHubJSONDSL } from "../dsl/GitHubDSL";
import { GitHubAPI } from "./github/GitHubAPI";
import * as NodeGitHub from "@octokit/rest";
/** Handles conforming to the Platform Interface for GitHub, API work is handle by GitHubAPI */
export declare class GitHub {
    readonly api: GitHubAPI;
    name: string;
    constructor(api: GitHubAPI);
    /**
     * Get the Code Review description metadata
     *
     * @returns {Promise<any>} JSON representation
     */
    getReviewInfo: () => Promise<GitHubPRDSL>;
    /**
     * Get the Code Review diff representation
     *
     * @returns {Promise<GitDSL>} the git DSL
     */
    getPlatformGitRepresentation: () => Promise<GitJSONDSL>;
    /**
     * Gets issue specific metadata for a PR
     */
    getIssue: () => Promise<GitHubIssue>;
    /**
     * Fails the current build, if status setting succeeds
     * then return true.
     */
    updateStatus: (passed: boolean, message: string, url?: string | undefined) => Promise<boolean>;
    /**
     * Returns the `github` object on the Danger DSL
     *
     * @returns {Promise<GitHubDSL>} JSON response of the DSL
     */
    getPlatformDSLRepresentation: () => Promise<GitHubJSONDSL>;
    supportsCommenting(): boolean;
    /**
     * Returns the response for the new comment
     *
     * @param {string} comment you want to post
     * @returns {Promise<any>} JSON response of new comment
     */
    createComment: (comment: string) => Promise<any>;
    /**
     * Deletes the main Danger comment, used when you have
     * fixed all your failures.
     *
     * @returns {Promise<boolean>} did it work?
     */
    deleteMainComment: (dangerID: string) => Promise<boolean>;
    /**
     * Either updates an existing comment, or makes a new one
     *
     * @param {string} newComment string value of comment
     * @returns {Promise<boolean>} success of posting comment
     */
    updateOrCreateComment(dangerID: string, newComment: string): Promise<boolean>;
    /**
     * Converts the PR JSON into something easily used by the Github API client.
     */
    APIMetadataForPR: (pr: GitHubPRDSL) => GitHubAPIPR;
    getFileContents: (path: string, repoSlug?: string | undefined, ref?: string | undefined) => Promise<string>;
}
export declare const githubJSONToGitHubDSL: (gh: GitHubJSONDSL, api: NodeGitHub) => GitHubDSL;
