import { OSMPlugin, OSMPluginType } from "../OSMPlugin";
import { MusicSheet, GraphicalMusicSheet, MusicSheetCalculator, Voice, Note } from "opensheetmusicdisplay";
import { VexFlowMusicSheetCalculator } from "opensheetmusicdisplay";
// importing VexFlowMusicSheetCalculator from MusicalScore led to the constructor not being found
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

    protected createState(voice: Voice): StateManager {
        const stateManager: StateManager = new StateManager();
        this.historyMap.setValue(voice, stateManager);
        return stateManager;
    }

    protected getVoiceState(voice: Voice): StateManager {
        return this.historyMap.getValue(voice);
    }

    protected updateGlobalState(voice: Voice, history: Note[]): void {
        this.historyMap.getValue(voice).updateGlobaleState(history);
    }
    protected setLocalState(voice: Voice, history: Note[]): void {
        this.historyMap.getValue(voice).setLocalState(history);
    }
    protected adaptLocalState(voice: Voice, note: Note): void {
        this.historyMap.getValue(voice).adaptLocalState(note);
    }
}


