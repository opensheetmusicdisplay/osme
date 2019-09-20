import { Distribution } from "../../../src/OSME/Common/Distribution";

/* tslint:disable:no-unused-expression */
describe("Distribution random algorithm", () => {

   it("works with sum=1 and array", (done: MochaDone) => {
      const subject: Distribution = new Distribution(1.0, [0.5, 0.5]);
      chai.expect(subject).to.not.be.undefined;
      chai.expect(subject.getSum()).to.not.be.undefined;
      chai.expect(subject.getValues()).to.not.be.undefined;
      chai.expect(subject.getWeightedRandomIndex()).to.not.be.undefined;
      done();
   });

   it("calculates correctly: dont exceed 5% error with 1000 iterations ", (done: MochaDone) => {
      // given constraints
      const poolAexpected: number = 0.5;
      const poolBexpected: number = 0.0;
      const poolCexpected: number = 0.5;

      const subject: Distribution = new Distribution(1.0, [0.5, 0.0, 0.5]);

      const proofPool: Array<number> = [0, 0, 0];
      const iterations: number = 1000;
      for (let i: number = 0; i < iterations; i++) {
         const testIndex: number = subject.getWeightedRandomIndex();
         chai.expect(testIndex).to.gte(0);
         chai.expect(testIndex).to.lte(2);
         proofPool[testIndex] = proofPool[testIndex] + 1;
      }

      console.log("DistributionTest: " + proofPool);
      // define alpha error;
      const error: number = 0.05;
      const poolAcheck: number = proofPool[0] / iterations;
      const poolBcheck: number = proofPool[1] / iterations;
      const poolCcheck: number = proofPool[2] / iterations;

      compareWithError(poolAexpected, poolAcheck, error);
      compareWithError(poolBexpected, poolBcheck, error);
      compareWithError(poolCexpected, poolCcheck, error);

      chai.expect(subject.getWeightedRandomIndex()).to.not.be.undefined;
      done();
   });

   it("calculates correctly: weights with 0.0 must not be taken", (done: MochaDone) => {
      const subject: Distribution = new Distribution(1.0, [0.8, 0.0]);
      const proofPool: Array<number> = [0, 0];
      const iterations: number = 1000;
      for (let i: number = 0; i < iterations; i++) {
         const testIndex: number = subject.getWeightedRandomIndex();
         proofPool[testIndex] = proofPool[testIndex] + 1;
      }
      console.log("DistributionTest: " + proofPool);
      chai.expect(proofPool[1]).to.lte(0);
      done();
   });

   it("calculates correctly: stay in bounds when sum=1", (done: MochaDone) => {
      const subject: Distribution = new Distribution(1.0, [0.5, 0.0, 0.5]);
      const proofPool: Array<number> = [0, 0, 0];
      const iterations: number = 1000;
      for (let i: number = 0; i < iterations; i++) {
         const testIndex: number = subject.getWeightedRandomIndex();
         chai.expect(testIndex).to.gte(0);
         chai.expect(testIndex).to.lte(2);
         proofPool[testIndex] = proofPool[testIndex] + 1;
      }
      console.log("DistributionTest: " + proofPool);
      done();
   });

   it("calculates correctly: stay in bounds when sum>1", (done: MochaDone) => {
      const subject: Distribution = new Distribution(1.0, [0.5, 0.5, 0.5, 0.5]);
      const proofPool: Array<number> = [0, 0, 0];
      const iterations: number = 1000;
      for (let i: number = 0; i < iterations; i++) {
         const testIndex: number = subject.getWeightedRandomIndex();
         chai.expect(testIndex).to.gte(0);
         chai.expect(testIndex).to.lte(3);
         proofPool[testIndex] = proofPool[testIndex] + 1;
      }
      console.log("DistributionTest: " + proofPool);
      done();
   });
   it("calculates correctly: stay in bounds when sum<1", (done: MochaDone) => {
      const subject: Distribution = new Distribution(1.0, [0.1, 0.1]);
      const proofPool: Array<number> = [0, 0, 0];
      const iterations: number = 1000;
      for (let i: number = 0; i < iterations; i++) {
         const testIndex: number = subject.getWeightedRandomIndex();
         chai.expect(testIndex).to.gte(0);
         chai.expect(testIndex).to.lte(1);
         proofPool[testIndex] = proofPool[testIndex] + 1;
      }
      console.log("DistributionTest: " + proofPool);
      done();
   });

   it("calculates correctly: incorrect params wont crash ", (done: MochaDone) => {
      const subject: Distribution = new Distribution(1.0, [0.1, 0.2, 0.3, 0.4, 0.5]);

      const proofPool: Array<number> = [0, 0, 0, 0, 0];
      const iterations: number = 1000;
      for (let i: number = 0; i < iterations; i++) {
         const testIndex: number = subject.getWeightedRandomIndex();
         proofPool[testIndex] = proofPool[testIndex] + 1;
      }

      console.log("DistributionTest: " + proofPool);
      chai.expect(subject.getWeightedRandomIndex()).to.not.be.undefined;
      done();
   });

   function compareWithError(expected: number, actual: number, error: number): void {
      chai.expect(expected).to.not.gt(actual + error);
      chai.expect(expected).to.not.lt(actual - error);
   }
});
