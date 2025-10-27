//************************************************************************************************
//
// Control Surface SDK
// Copyright (c)2020 PreSonus Software Ltd.
//
// Filename    : midiprotocol.ts
// Description : MIDI Protocol Definitions
//
//************************************************************************************************

/**
 * Provides a uint8 array for use in sysex messages.
 *
 * Example: create and setup a buffer.
 * ```
 * let fillBuffer = function ()
 * {
 *   let header = [
 *    // exclude start (0xFA), already added by begin()
 *    0x00,
 *    0x01,
 *    0x06
 *   ];
 *
 *   let byteValue=0x05;
 *   let textValue="sometext";
 *
 *   SysexBuffer buffer = new SysexBuffer ();
 *   buffer.begin (header); // header, start
 *   buffer.push (byteValue);
 *   buffer.appendAscii (textValue);
 *   buffer.end (0xF7); // end
 * }
 * ```
 */
export class SysexBuffer {
    static kMaxSysexLength = 512;
    data: Uint8Array<ArrayBuffer>;
    length: number;

    constructor() {
        this.data = new Uint8Array(SysexBuffer.kMaxSysexLength);
        this.length = 0;
    }
    /**
     * Begin SysEx message with given header.
     * @param {number[]} header
     */
    begin(header: number[]) {
        this.data[0] = 0xF0;
        this.length = 1;
        for (const i in header)
            this.data[this.length++] = header[i];
    }
    /** Terminate buffer. */
    end() {
        this.push(0xF7);
    }
    /**
     * Append 7-bit value.
     * @param {number} byteValue - Value to append.
     * */
    push(byteValue: number) {
        this.data[this.length++] = byteValue;
    }
    /**
     * Append ASCII string.
     * @param {string[]} text  ASCII string to append.
     */
    appendAscii(text: string) {
        for (let i = 0; i < text.length; i++) {
            let c = text.charCodeAt(i);
            if (c <= 0x7F)
                this.push(c);
        }
    }
}

export const PreSonus = {
    /**
     * MIDI status.
     */
    MIDI: {
        /** MIDI Status: Note Off */
        kNoteOff: 128,
        128: "kNoteOff",
        /** MIDI Status: Note On */
        kNoteOn: 144,
        144: "kNoteOn",
        /**  MIDI Status: Poly Pressure */
        kPolyPressure: 160,
        160: "kPolyPressure",
        /** MIDI Status: Controller */
        kController: 176,
        176: "kController",
        /** MIDI Status: Program Change */
        kProgramChange: 192,
        192: "kProgramChange",
        /** MIDI Status: Aftertouch */
        kAfterTouch: 208,
        208: "kAfterTouch",
        /** MIDI Status: Pitchbend */
        kPitchBend: 224,
        224: "kPitchBend",
    },

    /**
     * Standard MIDI Controllers.
     */
    MidiController: {
        /* Bank Select (MSB) */
        kBankSelectMSB: 0,
        0: "kBankSelectMSB",
        /* Modulation Wheel */
        kModWheel: 1,
        1: "kModWheel",
        /* Breath Controller */
        kBreathControl: 2,
        2: "kBreathControl",
        /* Foot Controller */
        kFootControl: 4,
        4: "kFootControl",
        /*  Portamento Time */
        kPortamentoTime: 5,
        5: "kPortamentoTime",
        /*  Data Entry (MSB) */
        kDataEntryMSB: 6,
        6: "kDataEntryMSB",
        /* Volume */
        kVolume: 7,
        7: "kVolume",
        /* Balance */
        kBalance: 8,
        8: "kBalance",
        /* Pan */
        kPan: 10,
        10: "kPan",
        /* Expression */
        kExpression: 11,
        11: "kExpression",
        /* Effect Control #1 */
        kEffectControl1: 12,
        12: "kEffectControl1",
        /* Effect Control #2 */
        kEffectControl2: 13,
        13: "kEffectControl2",
        /* General Purpose #1 */
        kGeneralPurpose1: 16,
        16: "kGeneralPurpose1",
        /* General Purpose #2 */
        kGeneralPurpose2: 17,
        17: "kGeneralPurpose2",
        /* General Purpose #3 */
        kGeneralPurpose3: 18,
        18: "kGeneralPurpose3",
        /* General Purpose #4 */
        kGeneralPurpose4: 19,
        19: "kGeneralPurpose4",
        /* Bank Select (LSB) */
        kBankSelectLSB: 32,
        32: "kBankSelectLSB",
        /* Data Entry (LSB) */
        kDataEntryLSB: 38,
        38: "kDataEntryLSB",
        /* Sustain Pedal (On/Off) */
        kSustainSwitch: 64,
        64: "kSustainSwitch",
        /* Portamento (On/Off) */
        kPortamentoSwitch: 65,
        65: "kPortamentoSwitch",
        /* Sustenuto (On/Off) */
        kSustenutoSwitch: 66,
        66: "kSustenutoSwitch",
        /* Soft Pedal (On/Off) */
        kSoftPedalSwitch: 67,
        67: "kSoftPedalSwitch",
        /* Legato Footswitch (On/Off) */
        kLegatoFootSwitch: 68,
        68: "kLegatoFootSwitch",
        /* Hold 2 (On/Off) */
        kHold2Switch: 69,
        69: "kHold2Switch",
        /* Sound Variation */
        kSoundVariation: 70,
        70: "kSoundVariation",
        /* Filter Resonance (Sound Timbre) */
        kFilterResonance: 71,
        71: "kFilterResonance",
        /* Release Time */
        kReleaseTime: 72,
        72: "kReleaseTime",
        /* Attack Time */
        kAttackTime: 73,
        73: "kAttackTime",
        /* Filter Cutoff (Sound Brightness) */
        kFilterCutoff: 74,
        74: "kFilterCutoff",
        /* Decay Time */
        kDecayTime: 75,
        75: "kDecayTime",
        /*  Vibrato Rate */
        kVibratoRate: 76,
        76: "kVibratoRate",
        /* Vibrato Depth */
        kVibratoDepth: 77,
        77: "kVibratoDepth",
        /* Vibrato Delay */
        kVibratoDelay: 78,
        78: "kVibratoDelay",
        /* Sound Controller #10 */
        kSoundControl10: 79,
        79: "kSoundControl10",
        /* General Purpose #5 */
        kGeneralPurpose5: 80,
        80: "kGeneralPurpose5",
        /* General Purpose #6 */
        kGeneralPurpose6: 81,
        81: "kGeneralPurpose6",
        /* General Purpose #7 */
        kGeneralPurpose7: 82,
        82: "kGeneralPurpose7",
        /* General Purpose #8 */
        kGeneralPurpose8: 83,
        83: "kGeneralPurpose8",
        /* Portamento Control */
        kPortamentoControl: 84,
        84: "kPortamentoControl",
        /* Effect Depth #1 */
        kEffectDepth1: 91,
        91: "kEffectDepth1",
        /* Effect Depth #2 */
        kEffectDepth2: 92,
        92: "kEffectDepth2",
        /* Effect Depth #3 */
        kEffectDepth3: 93,
        93: "kEffectDepth3",
        /* Effect Depth #4 */
        kEffectDepth4: 94,
        94: "kEffectDepth4",
        /* Effect Depth #5 */
        kEffectDepth5: 95,
        95: "kEffectDepth5",
        /* Data Increment */
        kDataIncrement: 96,
        96: "kDataIncrement",
        /* Data Decrement */
        kDataDecrement: 97,
        97: "kDataDecrement",
        /* NRPN Select LSB */
        kNRPNSelectLSB: 98,
        98: "kNRPNSelectLSB",
        /* NRPN Select MSB */
        kNRPNSelectMSB: 99,
        99: "kNRPNSelectMSB",
        /* RPN Select LSB */
        kRPNSelectLSB: 100,
        100: "kRPNSelectLSB",
        /* RPN Select MSB */
        kRPNSelectMSB: 101,
        101: "kRPNSelectMSB",
        /* All Sounds Off */
        kAllSoundsOff: 120,
        120: "kAllSoundsOff",
        /* Reset All Controllers */
        kResetAll: 121,
        121: "kResetAll",
        /*  Local Control (On/Off) */
        kLocalControlSwitch: 122,
        122: "kLocalControlSwitch",
        /*  All Notes Off */
        kAllNotesOff: 123,
        123: "kAllNotesOff",
        /* Omni Mode Off */
        kOmniModeOff: 124,
        124: "kOmniModeOff",
        /* Omni Mode On */
        kOmniModeOn: 125,
        125: "kOmniModeOn",
        /* Poly Mode (On/Off) */
        kPolyModeSwitch: 126,
        126: "kPolyModeSwitch",
        /*  Poly Mode On */
        kPolyModeOn: 127,
        127: "kPolyModeOn",
    },

    SysexBuffer,
}
