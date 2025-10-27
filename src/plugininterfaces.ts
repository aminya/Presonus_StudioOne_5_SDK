//************************************************************************************************
//
// Control Surface SDK
// Copyright (c)2021 PreSonus Software Ltd.
//
// Filename    : services/devices/music/sdk/plugininterfaces.ts
// Created by  : Mark Schlueter
// Description : Plugin script interfaces
//
//************************************************************************************************

export const PreSonus = {
    //************************************************************************************************
    // ISamplerUIEditor
    /** Interface to sampler editor. */
    //************************************************************************************************
    ISamplerUIEditor: {
        kIID: "{3D93F796-0235-4693-8238-B55A85CFB54F}",
        ActionID: {
            kZoom: "Zoom",
            kScroll: "Scroll",
            kScrollTo: "ScrollTo",
            kStartSample: "StartSample",
            kEndSample: "EndSample",
            kLoopStart: "LoopStart",
            kLoopEnd: "LoopEnd",
            kCopy: "Copy",
            kPaste: "Paste", // paste to item in focus
        }
    }
}
