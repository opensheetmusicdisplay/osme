import { SourceGeneratorPlugin, GeneratorPluginOptions } from "./SourceGeneratorPlugin";


export class ExampleSourceGenerator extends SourceGeneratorPlugin {

    constructor(options: GeneratorPluginOptions) {
        super(options);
    }
    public static NAME: string = "example_source_generator";
    public getPluginName(): string {
        return ExampleSourceGenerator.NAME;
    }
}
