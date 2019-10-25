import { ScaleKey, ScaleType, Tone } from "../../../src/OSME/Common";
import { SourceGeneratorOptions, DefaultInstrumentOptions } from "../../../src/OSME/SourceGenerator/SourceGeneratorParameters";
import { ExampleSourceGenerator } from "../../../src/OSME/SourceGenerator/ExampleSourceGenerator";
import { MusicSheet } from "../../../src/MusicalScore/MusicSheet";
import { SourceGeneratorPlugin } from "../../../src/OSME/SourceGenerator/SourceGeneratorPlugin";
import { RhythmInstruction, RhythmSymbolEnum } from "../../../src/MusicalScore/VoiceData/Instructions";
import { Fraction } from "../../../src";

/* tslint:disable:no-unused-expression */
describe("SourceGenerator Parameters", () => {

   it("GraphicalMusicSheet", (done: MochaDone) => {
      const options: SourceGeneratorOptions = {
         complexity: 0.5,
         measure_count: 5,
         tempo: 145.0,
         time_signature: new RhythmInstruction(new Fraction(4, 4), RhythmSymbolEnum.COMMON),
         scale_key: ScaleKey.create(ScaleType.MAJOR, Tone.C),
         instruments: [DefaultInstrumentOptions.get("Part 1")]
      };
      const plugin: SourceGeneratorPlugin = new ExampleSourceGenerator(options);

      const musicSheet: MusicSheet = plugin.generate();
      chai.expect(musicSheet).to.not.be.undefined;
      done();
   });
});
