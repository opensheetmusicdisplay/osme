
import { } from "xmlbuilder";
import xmlbuilder = require("xmlbuilder");
import { SourceMeasure, Pitch } from "../..";
import { Note } from "../../MusicalScore";

export class XMLDriver {

    private root: xmlbuilder.XMLElement;
    private currentMeasure: xmlbuilder.XMLElement;

    constructor() {
        this.root = undefined;
    }

    public begin(): void {
        this.root = xmlbuilder.create("root");
    }
    public beginMeasure(measure: SourceMeasure): void {
        this.currentMeasure = this.root.element("measure");
    }
    public endMeasure(): void {
        this.currentMeasure.end();
        this.currentMeasure = undefined;
    }
    public writeMeasureAttributes(measure: SourceMeasure): void {
        const divisionNumber: Number = 2;
        const clefSign: String = "G";
        const clefLine: Number = 2;
        const beats: Number = 2;
        const beatType: Number = 2;
        const keyFifths: Number = 2;
        const out: Object = {
            attributes: {
                divisions: { "#text": divisionNumber },
                clef: {
                    sign: { "#text": clefSign },
                    line: { "#text": clefLine }
                },
                time: {
                    beats: { "#text": beats },
                    "beat-type": { "#text": beatType }
                },
                key: {
                    fifth: { "#text": keyFifths },
                }
            }
        };
        this.currentMeasure.element(out);
    }

    public writeNote(note: Note): void {
        const step: String = Pitch.getNoteEnumString(note.Pitch.FundamentalNote);
        const octave: Number = note.Pitch.Octave.valueOf();
        const duration: Number = note.Length.RealValue;
        const type: Number = 2;
        const out: Object = {
            note: {
                pitch: {
                    step: { "#text": step },
                    octave: { "#text": octave }
                },
                duration: { "#text": duration },
                type: { "#text": type }
            }
        };
        this.currentMeasure.element(out);
    }

    public endAndReturn(): String {
        return this.root.end({ pretty: true });
    }
}
