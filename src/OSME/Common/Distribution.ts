export class Distribution<T> {
    private entries: Array<DistributionEntry<T>>;

    public constructor(values: Array<DistributionEntry<T>>) {
        this.entries = values;
    }

    public static EQUIVALENT_VALUES(sum: number, count: number): Array<number> {
        const values: Array<number> = new Array(count);
        const itemValue: number = (1.0 * sum) / (1.0 * count);
        console.log("Distribution: " + sum + " " + count + " " + itemValue);
        for (let i: number = 0; i < count; i++) {
            values[i] = itemValue;
            console.log("Distribution: values[i] " + values[i] + " " + values);
        }
        return values;
    }

    private calculateWeightSum(additionalWeights: Array<number> = undefined): number {
        let sum: number = 0.0;
        if (additionalWeights !== undefined) {
            for (let i: number = 0; i < this.entries.length; i++) {
                sum += this.entries[i].Weight * additionalWeights[i];
            }
        } else {
            for (let i: number = 0; i < this.entries.length; i++) {
                sum += this.entries[i].Weight;
            }
        }
        return sum;
    }

    public getValues(): Array<DistributionEntry<T>> {
        return this.entries;
    }

    public rollAndDraw(additionalWeights: Array<number> = undefined): T {
        // get the sum of all weights
        const sum: number = this.calculateWeightSum(additionalWeights);
        // choose a random between 0 and that sum as start distance
        let distance: number = Math.random() * sum;
        let nextIndex: number = 0;
        while (distance > 0) {
            // choose a random index for next element
            nextIndex = Math.floor(Math.random() * this.entries.length);
            let weight: number = this.entries[nextIndex].Weight;
            if (additionalWeights !== undefined) {
                weight *= additionalWeights[nextIndex];
            }
            distance = distance - weight;
        }
        return this.entries[nextIndex].Object;
    }
}

export class DistributionEntry<T> {
    private object: T;
    private weight: number;

    public constructor(object: T, weight: number) {
        this.object = object;
        this.weight = weight;
    }

    get Object(): T {
        return this.object;
    }

    get Weight(): number {
        return this.weight;
    }
}
