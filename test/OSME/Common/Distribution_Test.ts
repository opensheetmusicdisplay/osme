import { Distribution, DistributionEntry } from "../../../src/OSME/Common/Distribution";
import { Fraction } from "../../../src/Common/DataObjects";

/* tslint:disable:no-unused-expression */
describe("Distribution random algorithm", () => {

   it("works with array", (done: MochaDone) => {
      const values: Array<DistributionEntry<Fraction>> = [new DistributionEntry(new Fraction(1, 1), 0.10),
      new DistributionEntry(new Fraction(1, 2), 0.20),
      new DistributionEntry(new Fraction(1, 4), 0.40)];
      const subject: Distribution<Fraction> = new Distribution<Fraction>(0.5, values);
      chai.expect(subject).to.not.be.undefined;
      chai.expect(subject.getValues()).to.not.be.undefined;
      chai.expect(subject.rollAndDraw()).to.not.be.undefined;
      done();
   });

   it("calculates correctly: dont exceed 5% error with 1000 iterations ", (done: MochaDone) => {
      // this test only works when the sum of all weights is equal to 1!
      const values: Array<DistributionEntry<number>> = [new DistributionEntry(0, 0.6),
      new DistributionEntry(1, 0.0),
      new DistributionEntry(2, 0.4)];

      const subject: Distribution<number> = new Distribution<number>(0.5, values);
      const poolsCount: Array<number> = [0, 0, 0];
      const poolsExpectedWeight: Array<number> = [values[0].Weight,
      values[1].Weight,
      values[2].Weight];
      const iterations: number = 1000;
      for (let i: number = 0; i < iterations; i++) {
         const value: number = subject.rollAndDraw();
         chai.expect(value).to.gte(values[0].Object);
         chai.expect(value).to.lte(values[2].Object);
         poolsCount[value] += 1;
      }

      console.log("DistributionTest: " + poolsCount);
      // define alpha error;
      const error: number = 0.05;

      for (let i: number = 0; i < poolsCount.length; i++) {
         const poolCheck: number = poolsCount[i] / iterations;
         compareWithError(poolsExpectedWeight[i], poolCheck, error);
      }

      chai.expect(subject.rollAndDraw()).to.not.be.undefined;
      done();
   });

   it("calculates correctly: weights with 0.0 must not be taken", (done: MochaDone) => {
      const values: Array<DistributionEntry<number>> = [new DistributionEntry(0, 0.6),
      new DistributionEntry(1, 0.0)];
      const subject: Distribution<number> = new Distribution<number>(0.5, values);
      const proofPool: Array<number> = [0, 0];
      const iterations: number = 1000;
      for (let i: number = 0; i < iterations; i++) {
         const value: number = subject.rollAndDraw();
         proofPool[value] += 1;
      }
      console.log("DistributionTest: " + proofPool);
      chai.expect(proofPool[1]).to.lte(0);
      done();
   });

   it("calculates correctly: stay in bounds when sum=1", (done: MochaDone) => {
      const values: Array<DistributionEntry<number>> = [new DistributionEntry(0, 0.6),
      new DistributionEntry(1, 0.0),
      new DistributionEntry(2, 0.4)];

      const subject: Distribution<number> = new Distribution<number>(0.5, values);
      const proofPool: Array<number> = [0, 0, 0];
      const iterations: number = 1000;
      for (let i: number = 0; i < iterations; i++) {
         const value: number = subject.rollAndDraw();
         chai.expect(value).to.gte(0);
         chai.expect(value).to.lte(2);
         proofPool[value] += 1;
      }
      console.log("DistributionTest: " + proofPool);
      done();
   });

   it("calculates correctly: stay in bounds when sum>1", (done: MochaDone) => {
      const values: Array<DistributionEntry<number>> = [new DistributionEntry(0, 0.6),
      new DistributionEntry(1, 0.0),
      new DistributionEntry(2, 0.4),
      new DistributionEntry(3, 0.4)];

      const subject: Distribution<number> = new Distribution<number>(0.5, values);
      const proofPool: Array<number> = [0, 0, 0];
      const iterations: number = 1000;
      for (let i: number = 0; i < iterations; i++) {
         const testIndex: number = subject.rollAndDraw();
         chai.expect(testIndex).to.gte(0);
         chai.expect(testIndex).to.lte(3);
         proofPool[testIndex] += 1;
      }
      console.log("DistributionTest: " + proofPool);
      done();
   });

   it("calculates correctly: stay in bounds when sum<1", (done: MochaDone) => {
      const values: Array<DistributionEntry<number>> = [new DistributionEntry(0, 0.6),
      new DistributionEntry(1, 0.0)];
      const subject: Distribution<number> = new Distribution<number>(0.5, values);
      const proofPool: Array<number> = [0, 0, 0];
      const iterations: number = 1000;
      for (let i: number = 0; i < iterations; i++) {
         const testIndex: number = subject.rollAndDraw();
         chai.expect(testIndex).to.gte(0);
         chai.expect(testIndex).to.lte(1);
         proofPool[testIndex] += 1;
      }
      console.log("DistributionTest: " + proofPool);
      done();
   });

   it("calculates correctly: incorrect params wont crash ", (done: MochaDone) => {
      const values: Array<DistributionEntry<number>> = [new DistributionEntry(0, 0.1),
      new DistributionEntry(1, 0.2),
      new DistributionEntry(2, 0.3),
      new DistributionEntry(3, 0.4),
      new DistributionEntry(4, 0.5)];

      const subject: Distribution<number> = new Distribution<number>(0.5, values);
      const proofPool: Array<number> = [0, 0, 0, 0, 0];
      const iterations: number = 1000;
      for (let i: number = 0; i < iterations; i++) {
         const testIndex: number = subject.rollAndDraw();
         proofPool[testIndex] += 1;
      }

      console.log("DistributionTest: " + proofPool);
      chai.expect(subject.rollAndDraw()).to.not.be.undefined;
      done();
   });

   function compareWithError(expected: number, actual: number, error: number): void {
      chai.expect(actual).to.not.gt(expected + error);
      chai.expect(actual).to.not.lt(expected - error);
   }
});
