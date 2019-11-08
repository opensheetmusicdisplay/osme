
import { } from "xmlbuilder";
import { Note, SourceMeasure } from "../../MusicalScore";
import { ClefInstruction, AbstractNotationInstruction, KeyInstruction } from "../../MusicalScore/VoiceData/Instructions";
import { Pitch } from "../..";
import { AccidentalEnum } from "../../Common";

export class XMLPropertyTransformer {
    public pitchToAlterString(note: Note): String {
        if (note === undefined || note.Pitch === undefined) {
            return undefined;
        }
        switch (note.Pitch.Accidental) {
            case AccidentalEnum.SHARP: return "sharp";
            case AccidentalEnum.FLAT: return "flat";
            default: return undefined;
        }
    }

    public measureToNumber(measure: SourceMeasure): Number {
        return measure.MeasureNumber;
    }
    public measureToDivisions(measure: SourceMeasure): Number {
        return 1;
    }

    public clefToClefLine(clef: ClefInstruction): Number {
        return clef.ClefPitch.FundamentalNote;
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

    public keyToFifths(key: KeyInstruction): Number {
        return key.getFundamentalNotesOfAccidentals().length;
    }

    public noteToNoteString(note: Note): String {
        return Pitch.getNoteEnumString(note.Pitch.FundamentalNote);
    }

    public noteToOctaveNumber(note: Note): Number {
        return note.Pitch.Octave.valueOf() + 3;
    }

    public noteToDurationNumber(note: Note): Number {
        return note.Length.Numerator;
    }

    public noteToDurationType(note: Note): String {
        const val: Number = note.Length.RealValue;
        switch (val) {
            case 0.125: return "eigth";
            case 0.25: return "quarter";
            case 0.5: return "half";
            default: return "eigth";
        }
    }
}
