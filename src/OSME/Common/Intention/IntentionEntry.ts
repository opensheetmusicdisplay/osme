import { Pitch, Fraction } from "../../../Common";

export class MusicalEntry {
    public Pitch: Pitch;
    public Duration: Fraction;
}

export enum MusicalIntervalType {
    S0_UNISON,
    S1_SECOND_MINOR,
    S2_SECOND_MAJOR,
    S3_THIRD_MINOR,
    S4_THIRD_MAJOR,
    S5_FOURTH_PERFECT,
    S6_FOURTH_MINOR,
    S7_FIFTH_PERFECT,
    S8_SIXTH_MINOR,
    S9_SIXTH_MAJOR,
    S10_SEVENTH_MINOR,
    S11_SEVENTH_MAJOR,
    S12_OCTAVE,
}

export class NextFuture {
    public entries: Array<MusicalEntry>;
    public interval: MusicalIntervalType;
}
