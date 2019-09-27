import { ScaleKeyPatterns, ScaleKey, Tone } from "../../../src/OSME/Common";

/* tslint:disable:no-unused-expression */
describe("ScaleKey: Building scales", () => {

   it("result has the same size as pattern array", (done: MochaDone) => {
      const pattern: Array<number> = ScaleKeyPatterns.MAJOR;
      const tones: Array<Tone> = ScaleKey.buildTones(Tone.C, pattern);
      chai.expect(tones).to.not.be.undefined;
      chai.expect(tones.length).to.be.eq(pattern.length);
      done();
   });

});
