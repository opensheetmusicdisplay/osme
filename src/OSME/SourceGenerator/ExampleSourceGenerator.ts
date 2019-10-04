import { SourceGeneratorPlugin } from "./SourceGeneratorPlugin";
// tslint:disable-next-line: max-line-length
import { MusicSheet, SourceMeasure, Staff, Instrument, Voice, Note, VoiceEntry, SourceStaffEntry, InstrumentalGroup } from "../../MusicalScore";
import { Fraction, Pitch } from "../../Common";
import { ClefInstruction, KeyInstruction } from "../../MusicalScore/VoiceData/Instructions";
import { SourceGeneratorOptions, TimeSignature, DefaultInstrumentOptions, PitchSettings } from "./SourceGeneratorParameters";
import { ScaleKey, ScaleType, Tone } from "../Common";
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
            scale_key: ScaleKey.create(ScaleType.MAJOR, Tone.Gb),
            tempo: 145.0,
            time_signature: TimeSignature.common(),
            pitch_settings: PitchSettings.HARMONIC_SYMBOLS()
        };
        this.setOptions(options);
    }

    public generate(): MusicSheet {

        // const pattern: Array<Tone> = ScaleKey.buildTones(Tone.C, ScaleKeyPatterns.MAJOR);
        // console.log(pattern);
        this.options.pitch_settings = PitchSettings.HARMONIC_SYMBOLS();
        // console.log(this.options);

        const musicSheet: MusicSheet = this.createMusicSheet();
        const instrument: Instrument = this.configureInstruments(musicSheet);

        const measureCount: number = this.options.measure_count;

        const staff: Staff = this.createInstrumentStaff(instrument, musicSheet);
        const voice: Voice = this.createInstrumentVoice(instrument);
        super.createState(voice);

        const duration: Fraction = new Fraction(4, 4);

        const currentScale: ScaleKey = this.options.scale_key;

        for (let index: number = 0; index < measureCount; index++) {

            console.log("Creating measure %s", index);

            let currentMeasure: SourceMeasure;
            if (index === 0) {
                currentMeasure = this.createFirstSourceMeasure(new Fraction(0, 4), duration, this.options.scale_key);
            } else {
                currentMeasure = this.createSourceMeasure(new Fraction(4 * index, 4), duration);
            }
            // set index explicitly
            currentMeasure.MeasureNumber = index + 1;
            musicSheet.addMeasure(currentMeasure);

            // create some notes in some entries
            const localOptions: MeasureLocalOptions = {
                scaleKey: currentScale
            };
            this.generateNotes(currentMeasure, staff, voice, localOptions);
        }

        // finalize and polish the sheet
        musicSheet.fillStaffList();
        super.debugStatistics();
        return musicSheet;
    }

    private generateNotes(currentMeasure: SourceMeasure, staff: Staff, voice: Voice, localOptions: MeasureLocalOptions): Note[] {
        const history: Note[] = [];
        super.setLocalState(voice, []);
        for (let index: number = 0; index < 4; index++) {
            const musicalEntry: MusicalEntry = this.getNextEntry(localOptions.scaleKey);
            const pitch: Pitch = musicalEntry.Pitch;
            const note: Note = this.generateEntry(currentMeasure, staff, voice, new Fraction(index, 4), new Fraction(1, 4), pitch);
            super.adaptLocalState(voice, note);
            history.push(note);
        }
        super.updateGlobalState(voice, history);
        return history;
    }
    private getNextEntry(scaleKey: ScaleKey): MusicalEntry {
        const pitchSettings: PitchSettings = this.options.pitch_settings;
        const index: number = pitchSettings.getWeightedRandomIndex();
        const entry: MusicalEntry = new MusicalEntry();
        // das muss anders gehen!
        const tone: Tone = this.chooseScaleTone(scaleKey, index);
        entry.Pitch = tone.toPitch(2);
        if (entry.Pitch.Accidental !== scaleKey.tone.getAccidental()) {
            //entry.Pitch.DoEnharmonicChange();
        }
        entry.Duration = new Fraction(1, 4);

        if (entry.Pitch === undefined) {
            throw new Error("entry.pitch is undefined");
        }
        return entry;
    }
    private chooseScaleTone(scaleKey: ScaleKey, index: number): Tone {
        const newHalftone: number = (index) % scaleKey.getTones().length;
        return scaleKey.getTones()[newHalftone];
    }

    private generateEntry(currentMeasure: SourceMeasure, staff: Staff, voice: Voice, entryBegin: Fraction, entryDuration: Fraction, pitch: Pitch): Note {
        const staffEntry: SourceStaffEntry = currentMeasure.findOrCreateStaffEntry(entryBegin, 0, staff).staffEntry;
        const voiceEntry: VoiceEntry = currentMeasure.findOrCreateVoiceEntry(staffEntry, voice).voiceEntry;
        const note: Note = new Note(voiceEntry, staffEntry, entryDuration, pitch);
        voiceEntry.Notes.push(note);
        return note;
    }

    private createFirstSourceMeasure(beginFraction: Fraction, duration: Fraction, scaleKey: ScaleKey): SourceMeasure {
        const sourceMeasure: SourceMeasure = new SourceMeasure(1);
        const firstStaffEntry: SourceStaffEntry = new SourceStaffEntry(undefined, undefined);
        const clefInstruction: ClefInstruction = new ClefInstruction();

        const keyNumber: number = scaleKey.getKeyNumber();
        const mode: number = scaleKey.getKeyMode();
        const keyInstruction: KeyInstruction = new KeyInstruction(undefined, keyNumber, mode);
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

export interface MeasureLocalOptions {
    scaleKey: ScaleKey;
}
