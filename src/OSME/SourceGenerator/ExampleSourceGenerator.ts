import { SourceGeneratorPlugin, GeneratorPluginOptions } from "./SourceGeneratorPlugin";
// tslint:disable-next-line: max-line-length
import { MusicSheet, SourceMeasure, Staff, Instrument, Voice, Note, GraphicalMusicSheet, MusicSheetCalculator, VoiceEntry, SourceStaffEntry, InstrumentalGroup } from "../../MusicalScore";
import { Fraction, Pitch, NoteEnum, AccidentalEnum } from "../../Common";
import { VexFlowMusicSheetCalculator } from "../../MusicalScore/Graphical/VexFlow";
import { ClefInstruction, ClefEnum, KeyInstruction } from "../../MusicalScore/VoiceData/Instructions";


export class ExampleSourceGenerator extends SourceGeneratorPlugin {

    constructor(options: GeneratorPluginOptions) {
        super(options);
    }
    public static NAME: string = "example_source_generator";
    public getPluginName(): string {
        return ExampleSourceGenerator.NAME;
    }

    public generate(): MusicSheet {

        const musicSheet: MusicSheet = new MusicSheet();
        const instrumentGroup: InstrumentalGroup = new InstrumentalGroup("group", musicSheet, undefined);
        const instrument: Instrument = new Instrument(1, "piano", musicSheet, instrumentGroup);
        instrument.Visible = true;
        const staff: Staff = new Staff(instrument, 1);
        const voice: Voice = new Voice(instrument, 1);
        instrument.Voices.push(voice);
        instrument.Staves.push(staff);
        musicSheet.Staves.push(staff);
        musicSheet.InstrumentalGroups.push(instrumentGroup);
        musicSheet.Instruments.push(instrument);

        const sourceMeasure: SourceMeasure = new SourceMeasure(1);
        const firstStaffEntry: SourceStaffEntry = new SourceStaffEntry(undefined, undefined);
        const clefInstruction: ClefInstruction = new ClefInstruction();
        const keyInstruction: KeyInstruction = new KeyInstruction();
        clefInstruction.Parent = firstStaffEntry;
        firstStaffEntry.Instructions.push(clefInstruction);
        firstStaffEntry.Instructions.push(keyInstruction);

        sourceMeasure.FirstInstructionsStaffEntries[0] = firstStaffEntry;
        sourceMeasure.AbsoluteTimestamp = new Fraction(0, 1);
        sourceMeasure.Duration = new Fraction(4, 4);
        sourceMeasure.MeasureNumber = 1;

        musicSheet.addMeasure(sourceMeasure);

        const staffEntry: SourceStaffEntry = sourceMeasure.findOrCreateStaffEntry(new Fraction(0, 4), 0, staff).staffEntry;
        const voiceEntry: VoiceEntry = sourceMeasure.findOrCreateVoiceEntry(staffEntry, voice).voiceEntry;
        voiceEntry.Notes.push(new Note(voiceEntry, staffEntry, new Fraction(1, 4), new Pitch(NoteEnum.C, 0, AccidentalEnum.NONE)));

        musicSheet.fillStaffList();

        return musicSheet;
    }

    public generateGraphicalMusicSheet(sheet: MusicSheet): GraphicalMusicSheet {
        const calc: MusicSheetCalculator = new VexFlowMusicSheetCalculator();
        const graphic: GraphicalMusicSheet = new GraphicalMusicSheet(sheet, calc);
        calc.initialize(graphic);

        return graphic;
    }
}
