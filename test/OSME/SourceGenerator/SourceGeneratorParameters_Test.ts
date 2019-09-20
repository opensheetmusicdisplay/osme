import { ScaleKey, ScaleType } from "../../../src/OSME/Common";
import { SourceGeneratorOptions, TimeSignature, DefaultInstrumentOptions } from "../../../src/OSME/SourceGenerator/SourceGeneratorParameters";
import { ExampleSourceGenerator } from "../../../src/OSME/SourceGenerator/ExampleSourceGenerator";
import { MusicSheet } from "../../../src/MusicalScore/MusicSheet";
import { SourceGeneratorPlugin } from "../../../src/OSME/SourceGenerator/SourceGeneratorPlugin";
import { NoteEnum } from "../../../src/Common/DataObjects/Pitch";

/* tslint:disable:no-unused-expression */
describe("SourceGenerator Parameters", () => {

   it("GraphicalMusicSheet", (done: MochaDone) => {
      const options: SourceGeneratorOptions = {
         complexity: 0.5,
         measure_count: 5,
         tempo: 145.0,
         time_signature: TimeSignature.common(),
         scale_key: ScaleKey.create(ScaleType.MAJOR, NoteEnum.C),
         instruments: [DefaultInstrumentOptions.get("piano")]
      };
      const plugin: SourceGeneratorPlugin = new ExampleSourceGenerator(options);

      const musicSheet: MusicSheet = plugin.generate();
      chai.expect(musicSheet).to.not.be.undefined;
      done();
   });
});
