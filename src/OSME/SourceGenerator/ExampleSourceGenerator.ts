import { SourceGeneratorPlugin } from "./SourceGeneratorPlugin";
// tslint:disable-next-line: max-line-length
import { MusicSheet, SourceMeasure, Staff, Instrument, Voice, Note, VoiceEntry, SourceStaffEntry, InstrumentalGroup } from "../../MusicalScore";
import { Fraction, Pitch } from "../../Common";
import { ClefInstruction, KeyInstruction } from "../../MusicalScore/VoiceData/Instructions";
import { SourceGeneratorOptions, PitchSettings, DurationSettings } from "./SourceGeneratorParameters";
import { ScaleKey, Tone } from "../Common";
import { MusicalEntry } from "../Common/Intention/IntentionEntry";

export class ExampleSourceGenerator extends SourceGeneratorPlugin {

    constructor(options: SourceGeneratorOptions) {
        super(options);
    }
    public static NAME: string = "example_source_generator";

    private durationPossibilites: Fraction[];
    private measureDuration: Fraction;


    public getPluginName(): string {
        return ExampleSourceGenerator.NAME;
    }


    public generate(): MusicSheet {

        // HINT: USE THIS TOGGLES TO MANIPULATE THE ALGORITHM

        // this.options.pitch_settings = PitchSettings.HARMONIC_SYMBOLS();
        const bla: PitchSettings = PitchSettings.HARMONIC_SYMBOLS();
        console.log(bla);

        // this.options.duration_settings = DurationSettings.SIMPLE();
        const bla2: DurationSettings = DurationSettings.SIMPLE();
        console.log(bla2);

        this.durationPossibilites = [
            new Fraction(1, 1),
            new Fraction(1, 2),
            new Fraction(1, 4),
            new Fraction(1, 8),
            new Fraction(1, 16),
        ];

        this.measureDuration = new Fraction(this.options.time_signature.Rhythm.Numerator, this.options.time_signature.Rhythm.Denominator);
        // console.log(this.options);

        const musicSheet: MusicSheet = this.createMusicSheet();
        const instrument: Instrument = this.configureInstruments(musicSheet);

        const measureCount: number = this.options.measure_count;

        const staff: Staff = this.createInstrumentStaff(instrument, musicSheet);
        const voice: Voice = this.createInstrumentVoice(instrument);
        super.createState(voice);

        const currentScale: ScaleKey = this.options.scale_key;

        for (let index: number = 0; index < measureCount; index++) {

            console.log("Creating measure %s", index);

            const currentMeasure: SourceMeasure = this.createSourceMeasure( new Fraction(   this.measureDuration.Numerator * index,
                                                                                            this.measureDuration.Denominator),
                                                                            Fraction.createFromFraction(this.measureDuration));
            if (index === 0) {
                // add clef and key signature at first measure:
                this.setClefAndKeyInstruction(currentMeasure, this.options.scale_key);
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

        console.log("fillStaffList");
        // finalize and polish the sheet
        musicSheet.fillStaffList();
        super.debugStatistics();
        console.log("debugStatistics done");

        return musicSheet;
    }

    private generateNotes(currentMeasure: SourceMeasure, staff: Staff, voice: Voice, localOptions: MeasureLocalOptions): Note[] {
        const history: Note[] = [];
        super.setLocalState(voice, []);
        const durationSum: Fraction = new Fraction(0, 4);
        console.log("generateNotes");
        while (durationSum.RealValue < currentMeasure.Duration.RealValue) {
            const musicalEntry: MusicalEntry = this.getNextEntry(localOptions.scaleKey);
            const pitch: Pitch = musicalEntry.Pitch;
            const durationFraction: Fraction = musicalEntry.Duration;
            console.log(musicalEntry);

            const startPosition: Fraction = durationSum.clone();


            let note: Note = undefined;
            if (durationSum.RealValue + durationFraction.RealValue <= currentMeasure.Duration.RealValue) {
                // const durationFraction: Fraction = this.createFraction(duration);
                note = this.generateEntry(currentMeasure, staff, voice, startPosition, durationFraction, pitch);
                console.log("Add normal note:");
                console.log(durationFraction);
                durationSum.Add(durationFraction);
            } else {
                const diffDuration: Fraction = Fraction.minus(currentMeasure.Duration, durationSum);
                if (diffDuration.Numerator > 1) {
                    console.log("Skip diffDuration note:");
                    console.log(diffDuration);
                } else {
                    console.log("Add diffDuration note:");
                    console.log(diffDuration);
                    note = this.generateEntry(currentMeasure, staff, voice, startPosition, diffDuration, pitch);
                    durationSum.Add(diffDuration);
                }
            }
            if (note !== undefined) {
                super.adaptLocalState(voice, note);
                history.push(note);
            }
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
        entry.Duration = this.chooseDuration();
        console.log(entry.Duration);
        if (entry.Pitch === undefined) {
            throw new Error("entry.pitch is undefined");
        }
        return entry;
    }

    private chooseDuration(): Fraction {
        const index: number = this.options.duration_settings.getWeightedRandomIndex();
        if (index < this.durationPossibilites.length) {
            return this.durationPossibilites[index].clone();
        } else {
            return this.measureDuration.clone();
        }
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

    private setClefAndKeyInstruction(   sourceMeasure: SourceMeasure,
                                        scaleKey: ScaleKey,
                                        clefInstruction: ClefInstruction = new ClefInstruction()): SourceMeasure {
        const firstStaffEntry: SourceStaffEntry = new SourceStaffEntry(undefined, undefined);
        const keyNumber: number = scaleKey.getKeyNumber();
        const mode: number = scaleKey.getKeyMode();
        const keyInstruction: KeyInstruction = new KeyInstruction(undefined, keyNumber, mode);
        clefInstruction.Parent = firstStaffEntry;
        firstStaffEntry.Instructions.push(clefInstruction);
        firstStaffEntry.Instructions.push(keyInstruction);
        firstStaffEntry.Instructions.push(this.options.time_signature);
        sourceMeasure.FirstInstructionsStaffEntries[0] = firstStaffEntry;
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
        const instrument: Instrument = new Instrument(1, "Part 1", musicSheet, instrumentGroup);
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
