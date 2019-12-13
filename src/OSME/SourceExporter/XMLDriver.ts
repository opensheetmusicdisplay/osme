
import { } from "xmlbuilder";
import xmlbuilder = require("xmlbuilder");
import { SourceMeasure } from "opensheetmusicdisplay";
import { Note } from "opensheetmusicdisplay";
import { XMLPropertyTransformer } from "./XMLPropertyTransformer";
import { ClefInstruction, KeyInstruction } from "opensheetmusicdisplay";

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

    public begin(composer: String, title: String): void {
        this.root = xmlbuilder.create("score-partwise", {
            version: "1.0",
            encoding: "UTF-8",
            standalone: false,
            pubID: "-//Recordare//DTD MusicXML 3.0 Partwise//EN",
            sysID: "http://www.musicxml.org/dtds/partwise.dtd"
        });

        this.root.attribute("version", "3.0");
        const work: xmlbuilder.XMLElement = this.root.element("work");
        work.element("work-title", title);

        const identification: xmlbuilder.XMLElement = this.root.element("identification");
        const composerXml: xmlbuilder.XMLElement = identification.element("creator", composer);

        composerXml.attribute("type", "composer");
        // identification.element("rights", "Copyright © 2001 Recordare LLC");
        const encoding: xmlbuilder.XMLElement = identification.element("encoding");
        encoding.element("encoder", "Open Sheet Music Education");
        encoding.element("software", "Open Sheet Music Education - XMLExport");
        encoding.element("encoding-description", "MusicXML 3.0 generic notation with Open Sheet Music Education");

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
        const keyMode: String = (key === undefined) ? undefined : this.transformer.keyToMode(key);

        const beats: Number = measure.ActiveTimeSignature.Numerator;
        const beatType: Number = measure.ActiveTimeSignature.Denominator;

        this.currentMeasure = this.currentPart.element("measure");
        this.currentMeasure.att("number", measureNumber);

        const attributes: xmlbuilder.XMLElement = this.currentMeasure.element("attributes");
        attributes.element("divisions", divisions);

        if (printKey) {
            attributes.element({
                "key": {
                    fifths: { "#text": keyFifths },
                    mode: { "#text": keyMode },
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
        if (printClef) {
            attributes.element({
                "clef": {
                    sign: { "#text": clefSign },
                    line: { "#text": clefLine }
                }
            });
        }
    }

    public writeNote(note: Note, lastAccidental: number = 0): void {
        const step: String = this.transformer.noteToNoteString(note);
        const octave: Number = this.transformer.noteToOctaveNumber(note);
        const duration: Number = this.transformer.noteToDurationNumber(note);
        const durationType: String = this.transformer.noteToDurationType(note);
        const alterStep: Number = this.transformer.pitchToAlterStep(note);
        const alterString: String = this.transformer.pitchToAlterString(note);

        const xmlNote: xmlbuilder.XMLElement = this.currentMeasure.element("note");
        //    order is important! Pitch, duration,type
        const pitch: xmlbuilder.XMLElement = xmlNote.element("pitch");
        pitch.element("step", step);
        if (alterStep !== 0) {
            pitch.element("alter", alterStep);
        }
        pitch.element("octave", octave);
        xmlNote.element("duration", duration);
        xmlNote.element("type", durationType);

        console.log("lastAccidental:%s alterStep:%s alterString:%s", lastAccidental, alterStep, alterString);
        if (lastAccidental !== 0) {
            if (lastAccidental !== alterStep && alterString !== undefined) {
                xmlNote.element("accidental", alterString);
            }
        } else {
            if (alterString !== undefined) {
                xmlNote.element("accidental", alterString);
            }
        }
    }

    public endAndReturn(): String {
        return this.root.end({ pretty: true });
    }
}
