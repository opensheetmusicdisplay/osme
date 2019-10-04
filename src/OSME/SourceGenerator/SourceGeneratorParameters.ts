import { ScaleKey } from "../Common";
import { Pitch, NoteEnum, AccidentalEnum } from "../../Common";
import { ClefInstruction, MidiInstrument, RhythmSymbolEnum } from "../../MusicalScore/VoiceData/Instructions";
import { Distribution } from "../Common/Distribution";

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
    time_signature: TimeSignature;
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
export class TimeSignature {
    public numerator: number;
    public denominator: number;
    public type: RhythmSymbolEnum;

    public static create(num: number, denom: number): TimeSignature {
        return { numerator: num, denominator: denom, type: RhythmSymbolEnum.NONE };
    }

    public static common(): TimeSignature {
        return { numerator: 4, denominator: 4, type: RhythmSymbolEnum.COMMON };
    }

    public static cut(): TimeSignature {
        return { numerator: 4, denominator: 4, type: RhythmSymbolEnum.CUT };
    }
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

export class IntervalSettings extends Distribution {

}

// 1, 1/2, 1/4, 1/8, 1/16, 1/32
export class DurationSettings extends Distribution {
    constructor(sum: number, values: Array<number>) {
        super(sum, values);
    }
    public static EQUIVALENT(): DurationSettings {
        return new DurationSettings(1.0, Distribution.EQUIVALENT_VALUES(1.0, 6));
    }

    public static SIMPLE(): DurationSettings {
        return new DurationSettings(1.0, Distribution.EQUIVALENT_VALUES(1.0, 4));
    }

    public static TYPICAL(): DurationSettings {
        return new DurationSettings(1.0, [0.10, 0.20, 0.4, 0.2, 0.1]);
    }
}

export class PitchSettings extends Distribution {

    constructor(sum: number, values: Array<number>) {
        super(sum, values);
    }
    public static EQUIVALENT(): PitchSettings {
        return new PitchSettings(1.0, Distribution.EQUIVALENT_VALUES(1.0, 7));
    }
    public static HARMONIC_SYMBOLS(): PitchSettings {
        return new PitchSettings(1.0, [0.5, 0, 0, 0.3, 0.2, 0, 0]);
    }
}


