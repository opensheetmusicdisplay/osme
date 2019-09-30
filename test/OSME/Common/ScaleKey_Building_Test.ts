import { ScaleKeyPatterns, ScaleKey, Tone } from "../../../src/OSME/Common";

/* tslint:disable:no-unused-expression */
describe("ScaleKey: Building scales", () => {

   it("result has the same size as pattern array", (done: MochaDone) => {
      const pattern: Array<number> = ScaleKeyPatterns.MAJOR;
      const tones: Array<Tone> = ScaleKey.buildTones(Tone.C, pattern);
      chai.expect(tones).to.not.be.undefined;
      chai.expect(tones.length).to.be.eq(pattern.length - 1);
      done();
   });

   // MAJOR

   it("works for C Major", (done: MochaDone) => {
      const expectedTones: Array<Tone> = [Tone.C, Tone.D, Tone.E, Tone.F, Tone.G, Tone.A, Tone.B];
      const testTones: Array<Tone> = ScaleKey.buildTones(Tone.C, ScaleKeyPatterns.MAJOR);

      testArrayEquals(expectedTones, testTones);
      done();
   });

   it("works for G Major", (done: MochaDone) => {
      const expectedTones: Array<Tone> = [Tone.G, Tone.A, Tone.B, Tone.C, Tone.D, Tone.E, Tone.Fs];
      const testTones: Array<Tone> = ScaleKey.buildTones(Tone.G, ScaleKeyPatterns.MAJOR);

      testArrayEquals(expectedTones, testTones);
      done();
   });

   it("works for D Major", (done: MochaDone) => {
      const expectedTones: Array<Tone> = [Tone.D, Tone.E, Tone.Fs, Tone.G, Tone.A, Tone.B, Tone.Cs];
      const testTones: Array<Tone> = ScaleKey.buildTones(Tone.D, ScaleKeyPatterns.MAJOR);

      testArrayEquals(expectedTones, testTones);
      done();
   });

   it("works for A Major", (done: MochaDone) => {
      const expectedTones: Array<Tone> = [Tone.A, Tone.B, Tone.Cs, Tone.D, Tone.E, Tone.Fs, Tone.Gs];
      const testTones: Array<Tone> = ScaleKey.buildTones(Tone.A, ScaleKeyPatterns.MAJOR);

      testArrayEquals(expectedTones, testTones);
      done();
   });

   it("works for E Major", (done: MochaDone) => {
      const expectedTones: Array<Tone> = [Tone.E, Tone.Fs, Tone.Gs, Tone.A, Tone.B, Tone.Cs, Tone.Ds];
      const testTones: Array<Tone> = ScaleKey.buildTones(Tone.E, ScaleKeyPatterns.MAJOR);

      testArrayEquals(expectedTones, testTones);
      done();
   });

   it("works for B Major", (done: MochaDone) => {
      const expectedTones: Array<Tone> = [Tone.B, Tone.Cs, Tone.Ds, Tone.E, Tone.Fs, Tone.Gs, Tone.As];
      const testTones: Array<Tone> = ScaleKey.buildTones(Tone.B, ScaleKeyPatterns.MAJOR);

      testArrayEquals(expectedTones, testTones);
      done();
   });

   it("works for Fs Major", (done: MochaDone) => {
      const expectedTones: Array<Tone> = [Tone.Fs, Tone.Gs, Tone.As, Tone.B, Tone.Cs, Tone.Ds, Tone.Es];
      const testTones: Array<Tone> = ScaleKey.buildTones(Tone.Fs, ScaleKeyPatterns.MAJOR);

      testArrayEquals(expectedTones, testTones);
      done();
   });

   it("works for F Major", (done: MochaDone) => {
      const expectedTones: Array<Tone> = [Tone.F, Tone.G, Tone.A, Tone.Bb, Tone.C, Tone.D, Tone.E];
      const testTones: Array<Tone> = ScaleKey.buildTones(Tone.F, ScaleKeyPatterns.MAJOR);

      testArrayEquals(expectedTones, testTones);
      done();
   });

   it("works for Bb Major", (done: MochaDone) => {
      const expectedTones: Array<Tone> = [Tone.Bb, Tone.C, Tone.D, Tone.Eb, Tone.F, Tone.G, Tone.A];
      const testTones: Array<Tone> = ScaleKey.buildTones(Tone.Bb, ScaleKeyPatterns.MAJOR);

      testArrayEquals(expectedTones, testTones);
      done();
   });

   it("works for Eb Major", (done: MochaDone) => {
      const expectedTones: Array<Tone> = [Tone.Eb, Tone.F, Tone.G, Tone.Ab, Tone.Bb, Tone.C, Tone.D];
      const testTones: Array<Tone> = ScaleKey.buildTones(Tone.Eb, ScaleKeyPatterns.MAJOR);

      testArrayEquals(expectedTones, testTones);
      done();
   });

   it("works for Ab Major", (done: MochaDone) => {
      const expectedTones: Array<Tone> = [Tone.Ab, Tone.Bb, Tone.C, Tone.Db, Tone.Eb, Tone.F, Tone.G];
      const testTones: Array<Tone> = ScaleKey.buildTones(Tone.Ab, ScaleKeyPatterns.MAJOR);

      testArrayEquals(expectedTones, testTones);
      done();
   });

   it("works for Db Major", (done: MochaDone) => {
      const expectedTones: Array<Tone> = [ Tone.Db, Tone.Eb, Tone.F, Tone.Gb, Tone.Ab, Tone.Bb, Tone.C];
      const testTones: Array<Tone> = ScaleKey.buildTones(Tone.Db, ScaleKeyPatterns.MAJOR);

      testArrayEquals(expectedTones, testTones);
      done();
   });

   it("works for Gb Major", (done: MochaDone) => {
      const expectedTones: Array<Tone> = [Tone.Gb, Tone.Ab, Tone.Bb, Tone.Cb, Tone.Db, Tone.Eb, Tone.F];
      const testTones: Array<Tone> = ScaleKey.buildTones(Tone.Gb, ScaleKeyPatterns.MAJOR);

      testArrayEquals(expectedTones, testTones);
      done();
   });

   // MINOR

   function testArrayEquals(expectedTones: Array<Tone>, testTones: Array<Tone>): void {
      console.log("Expected   : ", expectedTones);
      console.log("Given Tones: ", testTones);
      chai.expect(testTones.length).to.be.eq(expectedTones.length);
      for (let i: number = 0; i < expectedTones.length; i++) {
         chai.expect(testTones[i]).to.be.eq(expectedTones[i]);
      }
   }

});
