import { SourceGeneratorPlugin } from "./SourceGeneratorPlugin";
// tslint:disable-next-line: max-line-length
import { MusicSheet, SourceMeasure, Staff, Instrument, Voice, Note, VoiceEntry, SourceStaffEntry, InstrumentalGroup } from "../../MusicalScore";
import { Fraction, Pitch, NoteEnum, AccidentalEnum } from "../../Common";
import { ClefInstruction, KeyInstruction } from "../../MusicalScore/VoiceData/Instructions";
import { SourceGeneratorOptions, TimeSignature, DefaultInstrumentOptions } from "./SourceGeneratorParameters";
import { ScaleKey, ScaleType } from "../Common";


export class ExampleSourceGenerator extends SourceGeneratorPlugin {

    constructor(options: SourceGeneratorOptions) {
        super(options);
    }
    public static NAME: string = "example_source_generator";

    public getPluginName(): string {
        return ExampleSourceGenerator.NAME;
    }

    public test(): void {
        const options: SourceGeneratorOptions = {
            instruments: [DefaultInstrumentOptions.get("piano")],
            measure_count: 5,
            scale_key: ScaleKey.create(ScaleType.MAJOR, NoteEnum.C),
            tempo: 145.0,
            time_signature: TimeSignature.common(),
        };
        this.setOptions(options);

        const sheet: MusicSheet = this.generate();
        this.generateGraphicalMusicSheet(sheet);
    }


    public generate(): MusicSheet {

        const musicSheet: MusicSheet = this.createMusicSheet();
        const instrument: Instrument = this.configureInstruments(musicSheet);

        const staff: Staff = this.createInstrumentStaff(instrument, musicSheet);

        const voice: Voice = this.createInstrumentVoice(instrument);

        const sourceMeasure: SourceMeasure = this.createFirstSourceMeasure();

        musicSheet.addMeasure(sourceMeasure);

        const staffEntry: SourceStaffEntry = sourceMeasure.findOrCreateStaffEntry(new Fraction(0, 4), 0, staff).staffEntry;
        const voiceEntry: VoiceEntry = sourceMeasure.findOrCreateVoiceEntry(staffEntry, voice).voiceEntry;
        voiceEntry.Notes.push(new Note(voiceEntry, staffEntry, new Fraction(1, 4), new Pitch(NoteEnum.C, 0, AccidentalEnum.NONE)));

        musicSheet.fillStaffList();

        return musicSheet;
    }



    private createFirstSourceMeasure(): SourceMeasure {
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
        return sourceMeasure;
    }

    private createInstrumentVoice(instrument: Instrument): Voice {
        const voice: Voice = new Voice(instrument, 1);
        instrument.Voices.push(voice);
        return voice;
    }

    private createInstrumentStaff(instrument: Instrument, musicSheet: MusicSheet): Staff {
        const staff: Staff = new Staff(instrument, 1);
        musicSheet.Staves.push(staff);
        instrument.Staves.push(staff);
        return staff;
    }

    private configureInstruments(musicSheet: MusicSheet): Instrument {
        const instrumentGroup: InstrumentalGroup = new InstrumentalGroup("group", musicSheet, undefined);
        const instrument: Instrument = new Instrument(1, "piano", musicSheet, instrumentGroup);
        musicSheet.InstrumentalGroups.push(instrumentGroup);
        musicSheet.Instruments.push(instrument);
        instrument.Visible = true;
        return instrument;
    }

    private createMusicSheet(): MusicSheet {
        return new MusicSheet();
    }
}
