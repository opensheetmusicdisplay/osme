import { OSMPlugin, OSMPluginType } from "../OSMPlugin";
import { MusicSheet, GraphicalMusicSheet, MusicSheetCalculator, VexFlowMusicSheetCalculator, Voice, Note } from "../../MusicalScore";
import { SourceGeneratorOptions } from "./SourceGeneratorParameters";
import { Dictionary } from "typescript-collections";
import { StateManager } from ".";

export abstract class SourceGeneratorPlugin implements OSMPlugin {


    protected historyMap: Dictionary<Voice, StateManager> = new Dictionary<Voice, StateManager>();
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

    public debugStatistics(): void {
        for (const key of this.historyMap.keys()) {
            const stateManager: StateManager = this.historyMap.getValue(key);
            stateManager.printStatistics();
        }
    }

    protected initState(voice: Voice): void {
        this.historyMap.setValue(voice, new StateManager());
    }

    protected updateGlobalState(voice: Voice, history: Note[]): void {
        this.historyMap.getValue(voice).updateGlobaleState(history);
    }
    protected updateLocalState(voice: Voice, history: Note[]): void {
        this.historyMap.getValue(voice).updateLocalState(history);
    }
}


