
import { } from "xmlbuilder";
import xmlbuilder = require("xmlbuilder");
import { SourceMeasure } from "../..";
import { Note } from "../../MusicalScore";
import { XMLPropertyTransformer } from "./XMLPropertyTransformer";
import { ClefInstruction, KeyInstruction } from "../../MusicalScore/VoiceData/Instructions";

export class XMLDriver {

    private transformer: XMLPropertyTransformer;
    private root: xmlbuilder.XMLElement;
    private partList: xmlbuilder.XMLElement;
    private currentMeasure: xmlbuilder.XMLElement;
    private currentPart: xmlbuilder.XMLElement;

    constructor(transformer: XMLPropertyTransformer) {
        this.root = undefined;
        this.transformer = transformer;
    }

    public begin(): void {
        this.root = xmlbuilder.create("score-partwise", {
            version: "1.0",
            encoding: "UTF-8",
            standalone: false,
            pubID: "-//Recordare//DTD MusicXML 3.0 Partwise//EN",
            sysID: "http://www.musicxml.org/dtds/partwise.dtd"
        });
        this.root.attribute("version", "3.0");
        this.partList = this.root.element("part-list");
    }


    public beginPart(partId: string): void {
        const part1: xmlbuilder.XMLElement = this.partList.element("score-part");
        part1.attribute("id", partId);
        part1.element("part-name", "Music");
        this.currentPart = this.root.element("part");
        this.currentPart.att("id", partId);
    }
    public endPart(): void {
        this.currentPart.end();
        this.currentPart = undefined;
    }


    public endMeasure(): void {
        this.currentMeasure.end();
        this.currentMeasure = undefined;
    }
    public beginMeasure(measure: SourceMeasure, printClef: Boolean = false, printTime: Boolean = false, printKey: Boolean = false, ): void {

        const measureNumber: Number = this.transformer.measureToNumber(measure);
        const divisions: Number = this.transformer.measureToDivisions(measure);
        const clef: ClefInstruction = this.transformer.getClefInstruction(measure);
        const clefSign: String = (clef === undefined) ? undefined : this.transformer.clefToClefSign(clef);
        const clefLine: Number = (clef === undefined) ? undefined : this.transformer.clefToClefLine(clef);

        const key: KeyInstruction = this.transformer.getKeyInstruction(measure);
        const keyFifths: Number = (key === undefined) ? undefined : this.transformer.keyToFifths(key);

        const beats: Number = measure.ActiveTimeSignature.Numerator;
        const beatType: Number = measure.ActiveTimeSignature.Denominator;

        this.currentMeasure = this.currentPart.element("measure");
        this.currentMeasure.att("number", measureNumber);

        const attributes: xmlbuilder.XMLElement = this.currentMeasure.element("attributes");
        attributes.element("divisions", divisions);
        if (printClef) {
            attributes.element({
                "clef": {
                    sign: { "#text": clefSign },
                    line: { "#text": clefLine }
                }
            });
        }
        if (printTime) {
            attributes.element({
                "time": {
                    beats: { "#text": beats },
                    "beat-type": { "#text": beatType }
                }
            });
        }
        if (printKey) {
            attributes.element({
                "key": {
                    fifth: { "#text": keyFifths },
                }
            });
        }
    }

    public writeNote(note: Note): void {
        const step: String = this.transformer.noteToNoteString(note);
        const octave: Number = this.transformer.noteToOctaveNumber(note);
        const duration: Number = this.transformer.noteToDurationNumber(note);
        const durationType: String = this.transformer.noteToDurationType(note);
        const alterString: String = this.transformer.pitchToAlterString(note);
        const out: Object = {
            note: {
                pitch: {
                    step: { "#text": step },
                    octave: { "#text": octave }
                },
                duration: { "#text": duration },
                type: { "#text": durationType }
            }
        };
        const xmlNote: xmlbuilder.XMLElement = this.currentMeasure.element(out);
        if (alterString !== undefined) {
            xmlNote.children[0].element("alter", alterString);
        }
    }

    public endAndReturn(): String {
        return this.root.end({ pretty: true });
    }
}
