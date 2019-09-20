export class Distribution {
    private sum: number;
    private values: Array<number>;

    public constructor(sum: number, values: Array<number>) {
        this.sum = sum;
        this.values = values;
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

    public getSum(): number {
        return this.sum;
    }

    public calculateSetSum(): number {
        let sum: number = 0.0;
        this.values.forEach(element => {
            sum += element;
        });
        this.sum = sum;
        return sum;
    }

    public getValues(): Array<number> {
        return this.values;
    }

    public getWeightedRandomIndex(): number {
        // prepare a sum of all weights (is 1.0 most of the time)
        let sum: number = 0.0;
        this.values.forEach(element => {
            sum += element;
        });

        // choose a random between 0 and that sum as start distance
        let distance: number = Math.random() * sum;
        let nextIndex: number = 0;
        while (distance > 0) {
            // choose a random index for next element
            nextIndex = Math.floor(Math.random() * this.values.length);
            const weight: number = this.values[nextIndex];
            distance = distance - weight;
        }
        return nextIndex;
    }

}
