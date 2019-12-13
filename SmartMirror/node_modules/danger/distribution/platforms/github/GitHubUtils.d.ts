import { GitHubPRDSL, GitHubUtilsDSL } from "./../../dsl/GitHubDSL";
import * as GitHub from "@octokit/rest";
declare const utils: (pr: GitHubPRDSL, api: GitHub) => GitHubUtilsDSL;
export default utils;
