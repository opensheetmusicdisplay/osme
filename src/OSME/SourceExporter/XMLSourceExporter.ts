import { XMLPropertyTransformer } from "./XMLPropertyTransformer";
import { XMLDriver } from "./XMLDriver";
import { MusicSheet, SourceMeasure, Note, VerticalSourceStaffEntryContainer, SourceStaffEntry, VoiceEntry } from "../../MusicalScore";

export class XMLSourceExporter {
    private transformer: XMLPropertyTransformer;
    private xmlDriver: XMLDriver;

    constructor() {
        this.transformer = new XMLPropertyTransformer();
        this.xmlDriver = new XMLDriver(this.transformer);
    }

    public export(sheet: MusicSheet): String {
        const measures: SourceMeasure[] = sheet.SourceMeasures;

        this.xmlDriver.begin();
        this.xmlDriver.beginPart("P1");

        let printedMeasureInstructions: Boolean = false;

        measures.forEach(measure => {
            const staffEntriesContainer: VerticalSourceStaffEntryContainer[] = measure.VerticalSourceStaffEntryContainers;
            const staffEntries: SourceStaffEntry[] = staffEntriesContainer[0].StaffEntries;
            const voiceEntry: VoiceEntry = staffEntries[0].VoiceEntries[0];

            if (!printedMeasureInstructions) {
                this.xmlDriver.beginMeasure(measure, true, true, true);
                printedMeasureInstructions = true;
            } else {
                this.xmlDriver.beginMeasure(measure);
            }
            console.log(voiceEntry);
            const notes: Note[] = voiceEntry.Notes;

            notes.forEach(note => {
                this.xmlDriver.writeNote(note);
            });

            this.xmlDriver.endMeasure();
        });

        const xmlString: String = this.xmlDriver.endAndReturn();
        console.log(xmlString);
        return xmlString;
    }
}
