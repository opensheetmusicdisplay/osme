import { OSMPlugin, OSMPluginType } from "../OSMPlugin";

export abstract class SourceGeneratorPlugin implements OSMPlugin {
    public getPluginType(): OSMPluginType { return OSMPluginType.SOURCE_GENERATOR; }
    public abstract getPluginName(): string;

    protected options: GeneratorPluginOptions;

    constructor(options: GeneratorPluginOptions) {
        this.options = options;
    }
}

export interface GeneratorPluginOptions {
    number_of_measures?: number;
    /** provided several options, this relies on the plugin on its now */
    [key: string]: any;
}
