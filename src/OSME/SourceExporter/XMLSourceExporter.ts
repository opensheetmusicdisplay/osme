import { XMLPropertyTransformer } from "./XMLPropertyTransformer";
import { XMLDriver } from "./XMLDriver";
import { MusicSheet, SourceMeasure, Note, VerticalSourceStaffEntryContainer, SourceStaffEntry, VoiceEntry } from "../../MusicalScore";
import { KeyInstruction } from "../../MusicalScore/VoiceData/Instructions";
import { NoteEnum } from "../..";

export class XMLSourceExporter {
    private transformer: XMLPropertyTransformer;
    private xmlDriver: XMLDriver;

    constructor() {
        this.transformer = new XMLPropertyTransformer();
        this.xmlDriver = new XMLDriver(this.transformer);
    }

    public export(sheet: MusicSheet): String {
        const measures: SourceMeasure[] = sheet.SourceMeasures;

        this.xmlDriver.begin(sheet.ComposerString, sheet.TitleString);
        this.xmlDriver.beginPart("P1");

        let printedMeasureInstructions: Boolean = false;

        let lastKeyInstruction: KeyInstruction = undefined;
        measures.forEach(measure => {
            const staffEntriesContainers: VerticalSourceStaffEntryContainer[] = measure.VerticalSourceStaffEntryContainers;

            const accidentMaps: Map<NoteEnum, number> = new Map();

            const keyInstruction: KeyInstruction = this.transformer.getKeyInstruction(measure);
            if (keyInstruction !== undefined) {
                lastKeyInstruction = keyInstruction;
            }
            if (lastKeyInstruction !== undefined) {
                const accidentals: NoteEnum[] = lastKeyInstruction.getFundamentalNotesOfAccidentals();
                const keyType: number = this.transformer.getKeyType(lastKeyInstruction);
                accidentals.forEach(note => {
                    accidentMaps[note] = keyType;
                });
            }

            if (!printedMeasureInstructions) {
                this.xmlDriver.beginMeasure(measure, true, true, true);
                printedMeasureInstructions = true;
            } else {
                this.xmlDriver.beginMeasure(measure);
            }

            staffEntriesContainers.forEach(staffEntriesContainer => {
                const staffEntries: SourceStaffEntry[] = staffEntriesContainer.StaffEntries;
                const voiceEntry: VoiceEntry = staffEntries[0].VoiceEntries[0];
                const notes: Note[] = voiceEntry.Notes;
                notes.forEach(note => {
                    const funNote: NoteEnum = note.Pitch.FundamentalNote;
                    const lastSeenAlterStep: number = accidentMaps[funNote];
                    this.xmlDriver.writeNote(note, lastSeenAlterStep);
                    const alterStep: Number = this.transformer.pitchToAlterStep(note);
                    if (alterStep !== 0) {
                        accidentMaps[funNote] = alterStep;
                    }
                });
            });

            this.xmlDriver.endMeasure();
        });

        const xmlString: String = this.xmlDriver.endAndReturn();
        return xmlString;
    }
}
