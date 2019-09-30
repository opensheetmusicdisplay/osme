import { Pitch, NoteEnum, AccidentalEnum } from "../../Common";
import { ScaleType } from "./ScaleType";

export class Tone {
    private symbol: number;
    private halftone: number;
    private accidental: number;
    private noteEnum: NoteEnum;

    public static Cb: Tone = new Tone(0, 11, -1, NoteEnum.C);
    public static C: Tone = new Tone(0, 0, 0, NoteEnum.C);
    public static Cs: Tone = new Tone(0, 1, +1, NoteEnum.C);
    public static Db: Tone = new Tone(1, 1, -1, NoteEnum.D);
    public static D: Tone = new Tone(1, 2, 0, NoteEnum.D);
    public static Ds: Tone = new Tone(1, 3, +1, NoteEnum.D);
    public static Eb: Tone = new Tone(2, 3, -1, NoteEnum.E);
    public static E: Tone = new Tone(2, 4, 0, NoteEnum.E);
    public static Es: Tone = new Tone(2, 5, +1, NoteEnum.E);
    public static Fb: Tone = new Tone(3, 4, -1, NoteEnum.F);
    public static F: Tone = new Tone(3, 5, 0, NoteEnum.F);
    public static Fs: Tone = new Tone(3, 6, +1, NoteEnum.F);
    public static Gb: Tone = new Tone(4, 6, -1, NoteEnum.G);
    public static G: Tone = new Tone(4, 7, 0, NoteEnum.G);
    public static Gs: Tone = new Tone(4, 8, +1, NoteEnum.G);
    public static Ab: Tone = new Tone(5, 8, -1, NoteEnum.A);
    public static A: Tone = new Tone(5, 9, 0, NoteEnum.A);
    public static As: Tone = new Tone(5, 10, +1, NoteEnum.A);
    public static Bb: Tone = new Tone(6, 10, -1, NoteEnum.B);
    public static B: Tone = new Tone(6, 11, 0, NoteEnum.B);
    public static Bs: Tone = new Tone(6, 0, +1, NoteEnum.B);

    private static allTones: Array<Tone> = undefined;

    public static getAllTones(): Array<Tone> {
        if (this.allTones === undefined) {
            this.allTones = new Array();
            this.allTones.push(Tone.Cb);
            this.allTones.push(Tone.C);
            this.allTones.push(Tone.Cs);
            this.allTones.push(Tone.Db);
            this.allTones.push(Tone.D);
            this.allTones.push(Tone.Ds);
            this.allTones.push(Tone.Eb);
            this.allTones.push(Tone.E);
            this.allTones.push(Tone.Es);
            this.allTones.push(Tone.Fb);
            this.allTones.push(Tone.F);
            this.allTones.push(Tone.Fs);
            this.allTones.push(Tone.Gb);
            this.allTones.push(Tone.G);
            this.allTones.push(Tone.Gs);
            this.allTones.push(Tone.Ab);
            this.allTones.push(Tone.A);
            this.allTones.push(Tone.As);
            this.allTones.push(Tone.Bb);
            this.allTones.push(Tone.B);
            this.allTones.push(Tone.Bs);
        }
        return this.allTones;
    }

    constructor(symbol: number, halftone: number, accidental: number, noteEnum: NoteEnum) {
        this.symbol = symbol;
        this.halftone = halftone;
        this.accidental = accidental;
        this.noteEnum = noteEnum;
    }

    public getSymbol(): number { return this.symbol; }
    public getHalftone(): number { return this.halftone; }
    public getAccidental(): number { return this.accidental; }
    public getNoteEnum(): number { return this.noteEnum; }
}
export class ScaleKeyPatterns {
    public static MAJOR: Array<number> = [0, 2, 2, 1, 2, 2, 2, 1];
    public static MINOR_NATURAL: Array<number> = [0, 2, 1, 2, 2, 1, 2, 2];
    public static MINOR_HARMONIC: Array<number> = [0, 2, 1, 2, 2, 1, 3, 1];
    public static MINOR_MELODIC: Array<number> = [0, 2, 1, 2, 2, 2, 2, 1];
}

export class ScaleKey {
    public note: Pitch;
    public type: any;
    private tones: Array<Tone>;

    constructor(note: Pitch, type: ScaleType) {
        this.note = note;
        this.type = type;
        this.buildPitches();
    }

    public static create(type: ScaleType, note: NoteEnum, accidental: AccidentalEnum = AccidentalEnum.NONE): ScaleKey {
        const pitch: Pitch = new Pitch(note, 0, accidental);
        return new ScaleKey(pitch, type);
    }

    private buildPitches(): void {
        this.tones = Array(7);
    }

    public getTones(): Array<Tone> { return this.tones; }

    public static buildTones(root: Tone, pattern: Array<number>): Array<Tone> {
        const tones: Array<Tone> = new Array<Tone>(pattern.length - 1);

        const startSymbol: number = root.getSymbol();
        const startStep: number = root.getHalftone();

        let currentStep: number = startStep;
        let currentSymbol: number = startSymbol;

        for (let i: number = 0; i < pattern.length - 1; i++) {

            const patternStep: number = pattern[i];
            currentStep = (currentStep + patternStep) % 12;

            console.log("CurrentSymbol %s, currentStep: %s", currentSymbol, currentStep);
            const candidates: Array<Tone> = Tone.getAllTones().filter(tone => tone.getSymbol() === currentSymbol);
            console.log(candidates);
            if (candidates.length > 0) {
                const matches: Array<Tone> = candidates.filter(tone => tone.getHalftone() === currentStep);
                console.log(matches);
                if (matches.length > 0) {
                    const chosenMatch: Tone = matches[0];
                    tones[i] = chosenMatch;
                    console.log("Chosen next Tone: ", chosenMatch);
                }
            } else {
                console.log("No candidates found!");
            }

            currentSymbol = (currentSymbol + 1) % 7;
        }
        return tones;
    }
}
