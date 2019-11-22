import { Note, Pitch } from "../..";
import { Dictionary } from "typescript-collections";
import { NoteEnum } from "../../Common";

export class StateManager {

    private noteEvents: Note[] = [];
    private noteFrequency: Dictionary<string, number> = new Dictionary<string, number>();

    private localNoteEvents: Note[] = [];
    private localNoteFrequency: Dictionary<string, number> = new Dictionary<string, number>();


    public updateGlobaleState(history: Note[]): void {
        for (const note of history) {
            this.noteEvents.push(note);
            this.updateEventsList(this.noteEvents, note);
            this.updateFrequencyMap(this.noteFrequency, note);
        }
    }

    public setLocalState(history: Note[]): void {
        if (history === undefined || history === []) {
            this.localNoteFrequency = new Dictionary<string, number>();
            this.localNoteEvents = [];
        } else {
            this.localNoteFrequency = new Dictionary<string, number>();
            this.localNoteEvents = history;
            for (const note of history) {
                this.updateFrequencyMap(this.localNoteFrequency, note);
            }
        }
    }

    public adaptLocalState(note: Note): void {
        this.updateEventsList(this.localNoteEvents, note);
        this.updateFrequencyMap(this.localNoteFrequency, note);
    }

    public printStatistics(): void {
        let noteFrequencyString: String = "noteFrequency: ";
        this.noteFrequency.forEach((key, value) => { noteFrequencyString += key + ": " + value + "; "; });
        // console.log(this.noteEvents);
        console.log(noteFrequencyString);
        console.log("local state:");
        let localNoteFrequencyString: String = "localNoteFrequency: ";
        this.localNoteFrequency.forEach((key, value) => { localNoteFrequencyString += key + ": " + value + "; "; });
        // console.log(this.localNoteEvents);
        console.log(localNoteFrequencyString);
    }

    private updateEventsList(list: Note[], next: Note): void {
        list.push(next);
    }

    private updateFrequencyMap(map: Dictionary<string, number>, note: Note): void {
        const key: string = this.getNoteKey(note);
        if (map.containsKey(key)) {
            const oldValue: number = map.getValue(key);
            const newValue: number = oldValue + 1;
            map.setValue(key, newValue);
        } else {
            map.setValue(key, 1);
        }
    }

    private getNoteKey(note: Note): string {
        const noteHalftone: number = note.Pitch.getHalfTone();
        const octave: number = note.Pitch.Octave;
        const accHalftone: number = Pitch.HalfTonesFromAccidental(note.Pitch.Accidental);
        const halftone: number = noteHalftone + accHalftone;
        const noteEnum: NoteEnum = note.Pitch.FundamentalNote;
        const enumNoteString: string = Pitch.getNoteEnumString(noteEnum);
        return enumNoteString + octave + "-" + halftone + "-" + note.Pitch.Accidental;
    }
}
