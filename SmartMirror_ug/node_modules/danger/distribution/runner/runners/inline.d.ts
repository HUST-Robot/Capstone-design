import { DangerResults } from "../../dsl/DangerResults";
import { DangerContext } from "../../runner/Dangerfile";
import { DangerRunner } from "./runner";
/**
 * Executes a Dangerfile at a specific path, with a context.
 * The values inside a Danger context are applied as globals to the Dangerfiles runtime.
 *
 * @param {DangerContext} dangerfileContext the global danger context
 */
export declare function createDangerfileRuntimeEnvironment(dangerfileContext: DangerContext): Promise<DangerContext>;
/**
 * Executes a Dangerfile at a specific path, with a context.
 * The values inside a Danger context are applied as globals to the Dangerfiles runtime.
 *
 * @param {string} filename the file path for the dangerfile
 * @param {any} environment the results of createDangerfileRuntimeEnvironment
 * @returns {DangerResults} the results of the run
 */
export declare function runDangerfileEnvironment(filename: string, originalContents: string | undefined, environment: DangerContext): Promise<DangerResults>;
declare const defaultExport: DangerRunner;
export default defaultExport;
