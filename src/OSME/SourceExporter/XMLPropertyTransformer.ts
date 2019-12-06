
import { } from "xmlbuilder";
import { Note, SourceMeasure } from "opensheetmusicdisplay";
import { ClefInstruction, AbstractNotationInstruction, KeyInstruction, KeyEnum } from "opensheetmusicdisplay";
import { Pitch } from "opensheetmusicdisplay";
import { AccidentalEnum, NoteEnum } from "opensheetmusicdisplay";

export class XMLPropertyTransformer {
    public pitchToAlterStep(note: Note): Number {
        if (note === undefined || note.Pitch === undefined || note.Pitch.Accidental === undefined) {
            return 0;
        }
        return Pitch.HalfTonesFromAccidental(note.Pitch.Accidental);
    }

    public pitchToAlterString(note: Note): String {
        if (note === undefined || note.Pitch === undefined || note.Pitch.Accidental === undefined) {
            return undefined;
        }
        switch (note.Pitch.Accidental) {
            case AccidentalEnum.SHARP: return "sharp";
            case AccidentalEnum.FLAT: return "flat";
            case AccidentalEnum.NATURAL: return "natural";
            case AccidentalEnum.NONE: return undefined;
            default: return undefined;
        }
    }

    public measureToNumber(measure: SourceMeasure): number {
        return measure.MeasureNumber;
    }
    public measureToDivisions(measure: SourceMeasure): number {
        return 32; // return 128 / 4;
    }

    public clefToClefLine(clef: ClefInstruction): number {
        if (clef.Line !== undefined) {
            return clef.Line;
        }
        switch (clef.ClefPitch.FundamentalNote) {
            case NoteEnum.G:
                return 2;
            case NoteEnum.F:
                return 4;
            case NoteEnum.C:
                return 3;
            default:
                return 2;
        }
    }

    public clefToClefSign(clef: ClefInstruction): String {
        return Pitch.getNoteEnumString(clef.ClefPitch.FundamentalNote);
    }

    public getClefInstruction(measure: SourceMeasure): ClefInstruction {
        if (this.guardInstructions(measure)) {
            return undefined;
        }
        const lists: AbstractNotationInstruction[] = measure.FirstInstructionsStaffEntries[0].Instructions.filter(
            item => item instanceof ClefInstruction
        );
        if (lists.length > 0 && lists[0] instanceof ClefInstruction) {
            return lists[0] as ClefInstruction;
        } else {
            return undefined;
        }
    }

    public getKeyInstruction(measure: SourceMeasure): KeyInstruction {
        if (this.guardInstructions(measure)) {
            return undefined;
        }
        const lists: AbstractNotationInstruction[] = measure.FirstInstructionsStaffEntries[0].Instructions.filter(
            item => item instanceof KeyInstruction
        );
        if (lists.length > 0 && lists[0] instanceof KeyInstruction) {
            return lists[0] as KeyInstruction;
        } else {
            return undefined;
        }
    }

    public guardInstructions(measure: SourceMeasure): Boolean {
        if (measure.FirstInstructionsStaffEntries.length < 1 || measure.FirstInstructionsStaffEntries[0] === undefined) {
            return true;
        } else {
            return false;
        }
    }

    public keyToFifths(key: KeyInstruction): number {
        return key.Key.valueOf();
    }
    public getKeyType(key: KeyInstruction): number {
        return Math.sign(key.Key.valueOf());
    }

    public keyToMode(key: KeyInstruction): String {
        switch (key.Mode) {
            case KeyEnum.major: return "major";
            case KeyEnum.minor: return "minor";
            default: return "major";
        }
    }

    public noteToNoteString(note: Note): String {
        return Pitch.getNoteEnumString(note.Pitch.FundamentalNote);
    }

    public noteToOctaveNumber(note: Note): number {
        return note.Pitch.Octave.valueOf() + 3;
    }

    public noteToDurationNumber(note: Note): number {
        const num: number = note.Length.Numerator;
        const denom: number = note.Length.Denominator;
        const divisions: number = 128.0;

        const newDenom: number = divisions / denom;
        const newNom: number = num * newDenom;
        if (newNom === 0) {
            return divisions;
        }
        return newNom;
    }

    public noteToDurationType(note: Note): String {
        const val: Number = note.Length.RealValue;
        switch (val) {
            case (1.0 / 128.0): return "128th";
            case (1.0 / 64.0): return "64th";
            case (1.0 / 32.0): return "32nd";
            case (1.0 / 16.0): return "16th";
            case (1.0 / 8.0): return "eighth";
            case 0.25: return "quarter";
            case 0.5: return "half";
            case 1.0: return "whole";
            default: return "WRONG";
        }
    }
}
