//************************************************************************************************
//
// Control Surface SDK
// Copyright (c)2020 PreSonus Software Ltd.
//
// Filename    : musicprotocol.ts
// Description : Music Protocol Definitions
//
//************************************************************************************************

/**
 * Namespace for music related definitions
 * and utility functions.
 */
class Music {
    static kPitchC0 = 24;
    static kPitchC1 = 36;
    /** Total number of pitches */
    static kNumPitches = 128;
    /**
     * Key names for an octave, ranging from
     * 'C' (index 0) to 'B' (index 11).
     */
    static kKeySymbols = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

    /**
     * Convert a pad index to symbolic pitch.
     * @param {number} padIndex  - Pad index to convert.
     */
    static padIndexToSymbolicPitch(padIndex: number) {
        return (Music.kPitchC1 + padIndex) % Music.kNumPitches;
    }
    /**
     * Convert a symbolic pitch to pad index.
     * @param {number} pitch - Pitch to convert.
     */
    static symbolicPitchToPadIndex(pitch: number) {
        let idx = pitch - Music.kPitchC1;
        return idx < 0 ? idx + Music.kNumPitches : idx;
    }
}

/**
  * Musical scales supported by PadSectionComponent.
  *
  * ```
  * padSection.component.setScale (PreSonus.MusicalScale.kMajor);
  * ```
  */
export const PreSonus = {
    MusicalScale: {
        /** Chromatic */
        kChromatic: 0,
        0: "kChromatic",
        /** Major */
        kMajor: 1,
        1: "kMajor",
        /** Melodic Minor */
        kMelodicMinor: 2,
        2: "kMelodicMinor",
        /** Harmonic Minor */
        kHarmonicMinor: 3,
        3: "kHarmonicMinor",
        /** Natural Minor */
        kNaturalMinor: 4,
        4: "kNaturalMinor",
        /** Major Pentatonic */
        kMajorPentatonic: 5,
        5: "kMajorPentatonic",
        /** Minor Pentatonic */
        kMinorPentatonic: 6,
        6: "kMinorPentatonic",
        /** Blues */
        kBlues: 7,
        7: "kBlues",
        /** Dorian */
        kDorian: 8,
        8: "kDorian",
        /** Mixolydian */
        kMixolydian: 9,
        9: "kMixolydian",
        /** Phyrigian */
        kPhrygian: 10,
        10: "kPhrygian",
        /** Major Triad */
        kMajorTriad: 11,
        11: "kMajorTriad",
        /** Minor Triad */
        kMinorTriad: 12,
        12: "kMinorTriad",
        /** Max scale index */
        kMaxScale: 12,
        // 12: "kMaxScale",
        /** Default scale */
        kDefault: 0,
        // 0: "kDefault",
    },
    Music,
}
