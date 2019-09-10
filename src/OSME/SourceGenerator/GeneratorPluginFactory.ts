import { SourceGeneratorPlugin } from "./SourceGeneratorPlugin";
import { ExampleSourceGenerator } from "./ExampleSourceGenerator";
import { SourceGeneratorOptions } from "./SourceGeneratorParameters";

export class GeneratorPluginFactory {

    public static build(name: string, options: SourceGeneratorOptions): SourceGeneratorPlugin {
        switch (name) {
            case ExampleSourceGenerator.NAME: return new ExampleSourceGenerator(options);
            default: {
                throw new Error("Plugin subtype not given");
            }
        }
    }
}
