import { SourceGeneratorPlugin, GeneratorPluginOptions } from "./SourceGeneratorPlugin";
import { MusicSheet, SourceMeasure, Staff, Instrument, Voice, Note, GraphicalMusicSheet, MusicSheetCalculator, StaffEntryLink, VoiceEntry } from "../../MusicalScore";
import { Fraction, Pitch, NoteEnum, AccidentalEnum } from "../../Common";
import { VexFlowMusicSheetCalculator } from "../../MusicalScore/Graphical/VexFlow";


export class ExampleSourceGenerator extends SourceGeneratorPlugin {

    constructor(options: GeneratorPluginOptions) {
        super(options);
    }
    public static NAME: string = "example_source_generator";
    public getPluginName(): string {
        return ExampleSourceGenerator.NAME;
    }

    public generate(): MusicSheet {

        const sheet: MusicSheet = new MusicSheet();
        const instrument: Instrument = new Instrument(1, "piano", sheet, undefined);
        const staff: Staff = new Staff(instrument, 0);
        const voice: Voice = new Voice(instrument, 1);

        const sourceMeasure: SourceMeasure = new SourceMeasure(1);
        sourceMeasure.AbsoluteTimestamp = new Fraction(0, 1);
        sourceMeasure.Duration = new Fraction(4, 4);
        sheet.addMeasure(sourceMeasure);

        const staffEntry: SourceStaffEntry = sourceMeasure.findOrCreateStaffEntry(new Fraction(0, 4), 0, staff).staffEntry;
        const voiceEntry: VoiceEntry = sourceMeasure.findOrCreateVoiceEntry(staffEntry, voice).voiceEntry;
        voiceEntry.Notes.push(new Note(voiceEntry, staffEntry, new Fraction(1, 4), new Pitch(NoteEnum.C, 0, AccidentalEnum.NONE)));
        return sheet;
    }

    public generateGraphicalMusicSheet(): GraphicalMusicSheet {
        const sheet: MusicSheet = this.generate();
        const calc: MusicSheetCalculator = new VexFlowMusicSheetCalculator();
        const graphic: GraphicalMusicSheet = new GraphicalMusicSheet(sheet, calc);
        return graphic;
    }
}
