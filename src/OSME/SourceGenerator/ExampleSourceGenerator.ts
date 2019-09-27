import { SourceGeneratorPlugin } from "./SourceGeneratorPlugin";
// tslint:disable-next-line: max-line-length
import { MusicSheet, SourceMeasure, Staff, Instrument, Voice, Note, VoiceEntry, SourceStaffEntry, InstrumentalGroup } from "../../MusicalScore";
import { Fraction, Pitch, NoteEnum } from "../../Common";
import { ClefInstruction, KeyInstruction } from "../../MusicalScore/VoiceData/Instructions";
import { SourceGeneratorOptions, TimeSignature, DefaultInstrumentOptions, PitchSettings } from "./SourceGeneratorParameters";
import { ScaleKey, ScaleType, ScaleKeyPatterns, Tone } from "../Common";
import { MusicalEntry } from "../Common/Intention/IntentionEntry";

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
            complexity: 0.5,
            instruments: [DefaultInstrumentOptions.get("piano")],
            measure_count: 5,
            scale_key: ScaleKey.create(ScaleType.MAJOR, NoteEnum.C),
            tempo: 145.0,
            time_signature: TimeSignature.common(),
            pitch_settings: PitchSettings.EQUIVALENT()
        };
        this.setOptions(options);

        const sheet: MusicSheet = this.generate();
        this.generateGraphicalMusicSheet(sheet);
    }

    public generate(): MusicSheet {

        const pattern: Array<Tone> = ScaleKey.buildTones(Tone.C, ScaleKeyPatterns.MAJOR);
        console.log(pattern);
        this.options.pitch_settings = PitchSettings.HARMONIC();
        console.log(this.options);

        const musicSheet: MusicSheet = this.createMusicSheet();
        const instrument: Instrument = this.configureInstruments(musicSheet);

        const measureCount: number = this.options.measure_count;

        const staff: Staff = this.createInstrumentStaff(instrument, musicSheet);

        const voice: Voice = this.createInstrumentVoice(instrument);
        super.createState(voice);

        const duration: Fraction = new Fraction(4, 4);

        for (let index: number = 0; index < measureCount; index++) {

            console.log("Creating measure %s", index);

            let currentMeasure: SourceMeasure;
            if (index === 0) {
                currentMeasure = this.createFirstSourceMeasure(new Fraction(0, 4), duration);
            } else {
                currentMeasure = this.createSourceMeasure(new Fraction(4 * index, 4), duration);
            }
            musicSheet.addMeasure(currentMeasure);

            // create some notes in some entries
            this.generateNotes(currentMeasure, staff, voice);
        }

        // finalize and polish the sheet
        musicSheet.fillStaffList();
        super.debugStatistics();
        return musicSheet;
    }

    private generateNotes(currentMeasure: SourceMeasure, staff: Staff, voice: Voice): Note[] {
        const history: Note[] = [];
        super.setLocalState(voice, []);
        for (let index: number = 0; index < 4; index++) {
            const musicalEntry: MusicalEntry = this.getNextEntry();
            const pitch: Pitch = musicalEntry.pitch;
            const note: Note = this.generateEntry(currentMeasure, staff, voice, new Fraction(index, 4), new Fraction(1, 4), pitch);
            super.adaptLocalState(voice, note);
            history.push(note);
        }
        super.updateGlobalState(voice, history);
        return history;
    }
    private getNextEntry(): MusicalEntry {
        const pitchSettings: PitchSettings = this.options.pitch_settings;
        const index: number = pitchSettings.getWeightedRandomIndex();
        console.log("index:" + index);
        const entry: MusicalEntry = new MusicalEntry();
        entry.pitch = Pitch.fromHalftone(index).withOctave(2);
        entry.duration = new Fraction(1, 4);
        return entry;
    }

    private generateEntry(currentMeasure: SourceMeasure, staff: Staff, voice: Voice, entryBegin: Fraction, entryDuration: Fraction, pitch: Pitch): Note {
        const staffEntry: SourceStaffEntry = currentMeasure.findOrCreateStaffEntry(entryBegin, 0, staff).staffEntry;
        const voiceEntry: VoiceEntry = currentMeasure.findOrCreateVoiceEntry(staffEntry, voice).voiceEntry;
        const note: Note = new Note(voiceEntry, staffEntry, entryDuration, pitch);
        voiceEntry.Notes.push(note);
        return note;
    }

    private createFirstSourceMeasure(beginFraction: Fraction, duration: Fraction): SourceMeasure {
        const sourceMeasure: SourceMeasure = new SourceMeasure(1);
        const firstStaffEntry: SourceStaffEntry = new SourceStaffEntry(undefined, undefined);
        const clefInstruction: ClefInstruction = new ClefInstruction();
        const keyInstruction: KeyInstruction = new KeyInstruction();
        clefInstruction.Parent = firstStaffEntry;
        firstStaffEntry.Instructions.push(clefInstruction);
        firstStaffEntry.Instructions.push(keyInstruction);
        sourceMeasure.FirstInstructionsStaffEntries[0] = firstStaffEntry;
        sourceMeasure.AbsoluteTimestamp = beginFraction;
        sourceMeasure.Duration = duration;
        sourceMeasure.MeasureNumber = 1;
        return sourceMeasure;
    }

    private createSourceMeasure(beginFraction: Fraction, duration: Fraction): SourceMeasure {
        const sourceMeasure: SourceMeasure = new SourceMeasure(1);
        sourceMeasure.AbsoluteTimestamp = beginFraction;
        sourceMeasure.Duration = duration;
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
