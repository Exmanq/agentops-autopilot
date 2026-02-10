export type ToolContext = {
    cwd: string;
    env: Record<string, string | undefined>;
};
export type Tool = {
    name: string;
    run: (input: string, ctx: ToolContext) => Promise<{
        output: string;
    }>;
};
export type ToolRegistry = {
    get: (name: string) => Tool | undefined;
    list: () => Tool[];
};
export declare function createInMemoryRegistry(): ToolRegistry;
