import { NodeVMOptions } from "vm2";
import { DangerContext } from "../../runner/Dangerfile";
import { DangerRunner } from "./runner";
export declare function createDangerfileRuntimeEnvironment(dangerfileContext: DangerContext): Promise<NodeVMOptions>;
export declare function runDangerfileEnvironment(filename: string, originalContents: string | undefined, environment: NodeVMOptions): Promise<{
    fails: any;
    warnings: any;
    messages: any;
    markdowns: any;
}>;
declare const defaultExport: DangerRunner;
export default defaultExport;
