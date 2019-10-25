import { XMLDriver } from "../../../src/OSME/SourceExporter";
import { SourceMeasure, Note, Fraction, Pitch, NoteEnum, AccidentalEnum } from "../../../src";

/* tslint:disable:no-unused-expression */
describe("SourceExporterDriver Test", () => {

   it("does not crash", (done: MochaDone) => {
      const driver: XMLDriver = new XMLDriver();

      driver.begin();
      const measure: SourceMeasure = new SourceMeasure(2);
      const length: Fraction = new Fraction(1, 2);
      const pitch: Pitch = new Pitch(NoteEnum.C, 4, AccidentalEnum.NATURAL);
      const note: Note = new Note(undefined, undefined, length, pitch);
      driver.beginMeasure(measure);
      driver.writeMeasureAttributes(measure);
      driver.writeNote(note);
      driver.endMeasure();
      const xmlString: String = driver.endAndReturn();
      console.log(xmlString);
      chai.expect(xmlString).to.not.be.undefined;
      done();
   });
});
