import { ScaleKey } from "../Common";
import { Pitch, NoteEnum, AccidentalEnum, Fraction } from "../../Common";
import { ClefInstruction, MidiInstrument, RhythmInstruction } from "../../MusicalScore/VoiceData/Instructions";
import { Distribution, DistributionEntry } from "../Common/Distribution";

/**
 * Global parameters for all sourceGenerator plugins.
 * Mandatory arguments are required for creating the sheet display and define constraints for source generation.
 * Other options and settings may affect underlying algorithms and can be used to fine-tune results.
 *
 * Not-null arguments must be given, otherwise generation would fail.
 */
export interface SourceGeneratorOptions {
    // a float between 0.0 and 1.0 describing the "complexity" or "difficulty" of the expected result
    complexity: number;
    // number of total measures for the sheet to contain
    measure_count: number;
    // tempo in bpm (float)
    tempo: number;
    // TimeSignature, which can be defined numerial "4/4" or via "C"
    time_signature: RhythmInstruction;
    // ScaleKey of the MusicSheet, must contain a Pitch where the Oktave is ignored
    scale_key: ScaleKey;
    // At least one instrument is needed.
    instruments: InstrumentOptions[];
    // optional, ordered array describing the relative frequency of Notes
    pitch_settings?: PitchSettings;
    // optional, ordered array describing the relative frequency of Intervals
    interval_settings?: IntervalSettings;
    // optional, map describing the relative frequency of Duration units
    duration_settings?: DurationSettings;

    /** hashmap with further options, relies on specific plugins on their own */
    other_settings?: Map<string, any>;
}

export class InstrumentOptions {
    public name: String;
    public midi: MidiInstrument;
    public rangeLowest: Pitch;
    public rangeHighest: Pitch;
    public clef: ClefInstruction;

    public static createDefault(name: string, midiInstrument: MidiInstrument, rangeLowest: Pitch, rangeHighest: Pitch): InstrumentOptions {
        if (rangeHighest.Frequency - rangeLowest.Frequency <= 0) {
            throw new Error("rangeLowest is not lower than rangeHighest!");
        }

        const clef: ClefInstruction = ClefInstruction.getDefaultClefFromMidiInstrument(midiInstrument);
        return {
            name: name,
            // tslint:disable-next-line: object-literal-sort-keys
            midi: midiInstrument,
            clef: clef,
            rangeLowest: rangeLowest,
            rangeHighest: rangeHighest,
        };
    }
}

export class DefaultInstrumentOptions extends InstrumentOptions {
    public static defaults: Map<string, InstrumentOptions> = new Map();
    private static init: boolean = false;

    public static get(key: string): InstrumentOptions {
        if (!DefaultInstrumentOptions.init) {
            this.buildMap();
        }
        return this.defaults.get(key);
    }
    public static buildMap(): void {
        const acc: AccidentalEnum = AccidentalEnum.NONE;
        const low: Pitch = new Pitch(NoteEnum.C, 0, acc);
        const high: Pitch = new Pitch(NoteEnum.C, 3, acc);
        this.defaults.set("piano", InstrumentOptions.createDefault("piano", MidiInstrument.Electric_Grand_Piano, low, high));
        this.defaults.set("trumpet", InstrumentOptions.createDefault("trumpet", MidiInstrument.Trumpet, low, high));
    }
}

export class IntervalSettings extends Distribution<number> {

}

export class ComplexityMap {

    public static getDurationSettings(factor: number): DurationSettings {
        return Array.from<DurationSettings>(DurationSettings.ALL().values()).filter(it => it.getComplexity() <= factor).last();
    }

    public static getPitchSettings(factor: number): PitchSettings {
        return Array.from<PitchSettings>(PitchSettings.ALL().values()).filter(it => it.getComplexity() <= factor).last();
    }

    public static getPitchIndex(factor: number): number {
        const map: Map<String, PitchSettings> = PitchSettings.ALL();
        const found: Array<PitchSettings> = Array.from<PitchSettings>(map.values()).filter(it => it.getComplexity() <= factor);
        if (found !== undefined && found.length > 0) { return found.length - 1; } else { return map.size - 1; }
    }

    public static getDurationIndex(factor: number): number {
        const map: Map<String, DurationSettings> = DurationSettings.ALL();
        const found: Array<DurationSettings> = Array.from<DurationSettings>(map.values()).filter(it => it.getComplexity() <= factor);
        if (found !== undefined && found.length > 0) { return found.length - 1; } else { return map.size - 1; }
    }
}
// 1, 1/2, 1/4, 1/8, 1/16, 1/32
export class DurationSettings extends Distribution<Fraction> {

    constructor(complexity: number, entries: Array<DistributionEntry<Fraction>>) {
        super(complexity, entries);
    }

    public static ALL(): Map<String, DurationSettings> {
        const map: Map<String, DurationSettings> = new Map();
        map.set("MINIMAL", this.MINIMAL());
        map.set("EASY", this.EASY());
        map.set("TYPICAL", this.TYPICAL());
        map.set("COMPLEX", this.COMPLEX());
        map.set("CRAZY", this.CRAZY());
        return map;
    }
    public static MINIMAL(): DurationSettings {
        return new DurationSettings(
            0.1,
            [new DistributionEntry(new Fraction(1, 1), 0.10),
            new DistributionEntry(new Fraction(1, 2), 0.30),
            new DistributionEntry(new Fraction(1, 4), 0.60)]);
    }
    public static EASY(): DurationSettings {
        return new DurationSettings(
            0.2,
            [new DistributionEntry(new Fraction(1, 1), 0.10),
            new DistributionEntry(new Fraction(1, 2), 0.30),
            new DistributionEntry(new Fraction(1, 4), 0.40),
            new DistributionEntry(new Fraction(1, 8), 0.20),
            new DistributionEntry(new Fraction(1, 16), 0.00)]);
    }
    public static TYPICAL(): DurationSettings {
        return new DurationSettings(
            0.5,
            [new DistributionEntry(new Fraction(1, 1), 0.05),
            new DistributionEntry(new Fraction(1, 2), 0.30),
            new DistributionEntry(new Fraction(1, 4), 0.40),
            new DistributionEntry(new Fraction(1, 8), 0.20),
            new DistributionEntry(new Fraction(1, 16), 0.05)]);
    }
    public static COMPLEX(): DurationSettings {
        return new DurationSettings(
            0.7,
            [new DistributionEntry(new Fraction(1, 1), 0.05),
            new DistributionEntry(new Fraction(1, 2), 0.20),
            new DistributionEntry(new Fraction(1, 4), 0.40),
            new DistributionEntry(new Fraction(1, 8), 0.20),
            new DistributionEntry(new Fraction(1, 16), 0.10),
            new DistributionEntry(new Fraction(1, 16), 0.05)]);
    }
    public static CRAZY(): DurationSettings {
        return new DurationSettings(
            0.9,
            [new DistributionEntry(new Fraction(1, 1), 0.05),
            new DistributionEntry(new Fraction(1, 2), 0.20),
            new DistributionEntry(new Fraction(1, 4), 0.20),
            new DistributionEntry(new Fraction(1, 8), 0.20),
            new DistributionEntry(new Fraction(1, 16), 0.20),
            new DistributionEntry(new Fraction(1, 16), 0.15)]);
    }
}

export class PitchSettings extends Distribution<number> {

    constructor(complexity: number, values: Array<DistributionEntry<number>>) {
        super(complexity, values);
    }

    public static ALL(): Map<String, PitchSettings> {
        const map: Map<String, PitchSettings> = new Map();
        map.set("MINIMAL", this.MINIMAL());
        map.set("EASY", this.EASY());
        map.set("PENTATONIC", this.PENTATONIC());
        map.set("HARMONIC", this.HARMONIC());
        map.set("EQUIVALENT", this.EQUIVALENT());
        return map;
    }

    public static MINIMAL(): PitchSettings {
        return new PitchSettings(
            0.1,
            [new DistributionEntry(0, 2),
            new DistributionEntry(1, 0),
            new DistributionEntry(2, 0),
            new DistributionEntry(3, 1),
            new DistributionEntry(4, 1),
            new DistributionEntry(5, 0),
            new DistributionEntry(6, 0)]);
    }

    public static EASY(): PitchSettings {
        return new PitchSettings(
            0.4,
            [new DistributionEntry(0, 10),
            new DistributionEntry(1, 3),
            new DistributionEntry(2, 3),
            new DistributionEntry(3, 7),
            new DistributionEntry(4, 7),
            new DistributionEntry(5, 2),
            new DistributionEntry(6, 2)]);
    }

    public static PENTATONIC(): PitchSettings {
        return new PitchSettings(
            0.3,
            [new DistributionEntry(0, 1),
            new DistributionEntry(1, 1),
            new DistributionEntry(2, 0),
            new DistributionEntry(3, 1),
            new DistributionEntry(4, 1),
            new DistributionEntry(5, 1),
            new DistributionEntry(6, 0)]);
    }

    public static HARMONIC(): PitchSettings {
        return new PitchSettings(
            0.6,
            [new DistributionEntry(0, 10),
            new DistributionEntry(1, 5),
            new DistributionEntry(2, 6),
            new DistributionEntry(3, 10),
            new DistributionEntry(4, 8),
            new DistributionEntry(5, 7),
            new DistributionEntry(6, 2)]);
    }

    public static EQUIVALENT(): PitchSettings {
        return new PitchSettings(
            0.8,
            [new DistributionEntry(0, 1),
            new DistributionEntry(1, 1),
            new DistributionEntry(2, 1),
            new DistributionEntry(3, 1),
            new DistributionEntry(4, 1),
            new DistributionEntry(5, 1),
            new DistributionEntry(6, 1)]);
    }

}


