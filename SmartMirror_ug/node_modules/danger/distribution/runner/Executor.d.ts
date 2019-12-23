import { DangerContext } from "./Dangerfile";
import { DangerDSL } from "../dsl/DangerDSL";
import { CISource } from "../ci_source/ci_source";
import { Platform } from "../platforms/platform";
import { DangerResults } from "../dsl/DangerResults";
import { DangerRunner } from "./runners/runner";
export interface ExecutorOptions {
    /** Should we do a text-only run? E.g. skipping comments */
    stdoutOnly: boolean;
    /** Should the output be submitted as a JSON string? */
    jsonOnly: boolean;
    /** Should Danger post as much info as possible */
    verbose: boolean;
    /** A unique ID to handle multiple Danger runs */
    dangerID: string;
}
export declare class Executor {
    readonly ciSource: CISource;
    readonly platform: Platform;
    readonly runner: DangerRunner;
    readonly options: ExecutorOptions;
    private readonly d;
    constructor(ciSource: CISource, platform: Platform, runner: DangerRunner, options: ExecutorOptions);
    /** TODO: Next two functions aren't used in Danger, are they used in Peril? */
    /** Mainly just a dumb helper because I can't do
     * async functions in danger-run.js
     * @param {string} file the path to run Danger from
     * @returns {Promise<DangerResults>} The results of the Danger run
     */
    setupAndRunDanger(file: string): Promise<DangerResults>;
    /**
     *  Runs all of the operations for a running just Danger
     * @returns {DangerfileRuntimeEnv} A runtime environment to run Danger in
     */
    setupDanger(): Promise<DangerContext>;
    /**
     *  Runs all of the operations for a running just Danger
     * @param {string} file the filepath to the Dangerfile
     * @returns {Promise<DangerResults>} The results of the Danger run
     */
    runDanger(file: string, runtime: DangerContext): Promise<DangerResults>;
    /**
     * Sets up all the related objects for running the Dangerfile
     * @returns {void} It's a promise, so a void promise
     */
    dslForDanger(): Promise<DangerDSL>;
    /**
     * Handle the message aspects of running a Dangerfile
     *
     * @param {DangerResults} results a JSON representation of the end-state for a Danger run
     */
    handleResults(results: DangerResults): Promise<void>;
    /**
     * Handle showing results inside the shell.
     *
     * @param {DangerResults} results a JSON representation of the end-state for a Danger run
     */
    handleResultsPostingToSTDOUT(results: DangerResults): Promise<void>;
    /**
     * Handle showing results inside a code review platform
     *
     * @param {DangerResults} results a JSON representation of the end-state for a Danger run
     */
    handleResultsPostingToPlatform(results: DangerResults): Promise<void>;
    /**
     * Takes an error (maybe a bad eval) and provides a DangerResults compatible object
     * @param error Any JS error
     */
    resultsForError(error: Error): {
        fails: {
            message: string;
        }[];
        warnings: never[];
        messages: never[];
        markdowns: string[];
    };
}
