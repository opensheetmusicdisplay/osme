import { Note } from "../..";
import { Dictionary } from "typescript-collections";

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
    public updateLocalState(history: Note[]): void {
        if (history === undefined || history === []) {
            this.localNoteFrequency = new Dictionary<string, number>();
            this.localNoteEvents = [];
        } else {
            for (const note of history) {
                this.updateEventsList(this.localNoteEvents, note);
                this.updateFrequencyMap(this.localNoteFrequency, note);
            }
        }
    }

    public printStatistics(): void {
        console.log("global state:");
        console.log(this.noteEvents);
        console.log(this.noteFrequency);
        console.log("local state:");
        console.log(this.localNoteEvents);
        console.log(this.localNoteFrequency);
    }

    private updateEventsList(list: Note[], next: Note): void {
        list.push(next);
    }

    private updateFrequencyMap(map: Dictionary<string, number>, note: Note): void {

        const key: string = note.Pitch.ToString();
        if (map.containsKey(key)) {
            const oldValue: number = map.getValue(key);
            const newValue: number = oldValue + 1;
            map.setValue(key, newValue);
        } else {
            map.setValue(key, 1);
        }
    }
}
