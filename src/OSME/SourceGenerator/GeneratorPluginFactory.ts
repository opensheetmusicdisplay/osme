import { GeneratorPluginOptions, SourceGeneratorPlugin } from "./SourceGeneratorPlugin";
import { ExampleSourceGenerator } from "./ExampleSourceGenerator";

export class GeneratorPluginFactory {

    public static build(name: string, options: GeneratorPluginOptions): SourceGeneratorPlugin {
        switch (name) {
            case ExampleSourceGenerator.NAME: return new ExampleSourceGenerator(options);
            default: {
                throw new Error("Plugin subtype not given");
            }
        }
    }
}
