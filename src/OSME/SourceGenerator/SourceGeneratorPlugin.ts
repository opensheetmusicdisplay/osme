import { OSMPlugin, OSMPluginType } from "../OSMPlugin";
import { MusicSheet, GraphicalMusicSheet, MusicSheetCalculator, VexFlowMusicSheetCalculator } from "../../MusicalScore";
import { SourceGeneratorOptions } from "./SourceGeneratorParameters";

export abstract class SourceGeneratorPlugin implements OSMPlugin {
    public getPluginType(): OSMPluginType { return OSMPluginType.SOURCE_GENERATOR; }
    public abstract getPluginName(): string;
    public abstract generate(): MusicSheet;

    protected options: SourceGeneratorOptions;

    constructor(options: SourceGeneratorOptions) {
        this.options = options;
    }

    public setOptions(options: SourceGeneratorOptions): void {
        this.options = options;
    }

    public generateGraphicalMusicSheet(sheet: MusicSheet): GraphicalMusicSheet {
        const calc: MusicSheetCalculator = new VexFlowMusicSheetCalculator();
        const graphic: GraphicalMusicSheet = new GraphicalMusicSheet(sheet, calc);
        calc.initialize(graphic);

        return graphic;
    }
}


