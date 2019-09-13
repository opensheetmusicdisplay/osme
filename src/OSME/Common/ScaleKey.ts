import { Pitch, NoteEnum, AccidentalEnum } from "../../Common";
import { ScaleType } from "./ScaleType";

export class ScaleKey {
    public note: Pitch;
    public type: any;
    constructor(note: Pitch, type: ScaleType) {
        this.note = note;
        this.type = type;
    }

    public static create(type: ScaleType, note: NoteEnum, accidental: AccidentalEnum = AccidentalEnum.NONE): ScaleKey {
        const pitch: Pitch = new Pitch(note, 0, accidental);
        return new ScaleKey(pitch, type);
    }
}
