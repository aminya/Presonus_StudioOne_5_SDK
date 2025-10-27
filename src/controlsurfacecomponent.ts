//************************************************************************************************
//
// Control Surface SDK
// Copyright (c)2016-2020 PreSonus Software Ltd.
//
// Filename    : controlsurfacecomponent.ts
// Description : Utilities for JavaScript Control Surface implementation
//
//************************************************************************************************

import { Host } from "./host";

//************************************************************************************************
// PadSection
//************************************************************************************************
class PadSection {
    static kMenuUseListAccess = "listaccess";
    static kMenuUseMusicInput = "musicinput";
    static kCommandItemDirect = "direct";
    static kCommandItemUserAssignable = "userassignable";
    /** Notification: current bank changed. */
    static kCurrentBankChanged = "currentBankChanged";
    /** Notification: keyboard mode changed. */
    static kKeyboardModeChanged = "keyboardModeChanged";

    /** Add command to 'commands'. */
    static addCommand(
        commands: { padIndex: number; category: string; name: string; args: string[]; flags: string[]; zone: string; color: string; }[],
        padIndex: number,
        category: string,
        name: string,
        args: string[],
        flags: string[],
        zone: string,
        color: string) {
        commands.push({ "padIndex": padIndex, "category": category, "name": name, "args": args, "flags": flags, "zone": zone, "color": color });
    }
}


//************************************************************************************************
// NoteRepeat
//************************************************************************************************
class NoteRepeat {
    static kActive = "active";
    static kSpread = "spread";
    static kSpreadNote = "spreadnote";
    static kSpreadNoteSymbolic = "spreadnotesymbolic";
    static kRate = "rate"; // rate parameterstatic .k2thPpq = NoteRepeat.calcBeatLength(2, false);
    static k2thTPpq = NoteRepeat.calcBeatLength(2, true);
    static k4thPpq = NoteRepeat.calcBeatLength(4, false);
    static k4thTPpq = NoteRepeat.calcBeatLength(4, true);
    static k8thPpq = NoteRepeat.calcBeatLength(8, false);
    static k8thTPpq = NoteRepeat.calcBeatLength(8, true);
    static k16thPpq = NoteRepeat.calcBeatLength(16, false);
    static k16thTPpq = NoteRepeat.calcBeatLength(16, true);
    static k32thPpq = NoteRepeat.calcBeatLength(32, false);
    static k32thTPpq = NoteRepeat.calcBeatLength(32, true);
    static k64thPpq = NoteRepeat.calcBeatLength(64, false);
    static k64thTPpq = NoteRepeat.calcBeatLength(64, true);

    /**
     * Calculate beat length.
     *
     * @param denominator
     * @param triplet  Calculate as triplet.
     */
    static calcBeatLength(denominator: number, triplet: boolean) {
        if (denominator == 0)
            return 0;
        const typeFactor = triplet ? (2.0 / 3.0) : 1.0;
        return (4.0 / denominator) * typeFactor;
    }
}


type Element = {
    isConnected: () => boolean;
    invokeMethod: (method: string, context?: string, arg?: any) => void;
    invokeChildMethod: (parentMethod: string, childMethod: string, childContext?: string, arg?: any) => void;
};

type Component = {
    hostComponent: {
        classID: string;
    };
};

type BankElement = {
    getElementCount: () => number;
    getElement: (index: number) => any;
};

//************************************************************************************************
// Host Utilities
//************************************************************************************************
/**
 * Utility functions for interacting with the host application.
 */
class HostUtils {
    static kEditorSignals = "CCL.EditorRegistry";
    static kEditorActivated = "EditorActivated";
    static kEngineEditingSignals = "Engine.Editing";
    static kTrackEditorChanged = "TrackEditorChanged";
    static kEditorTypeNone = "";
    static kEditorTypeArrangement = "TrackListComponent";
    static kEditorTypeMusic = "MusicEditor";
    static kEditorTypeAudio = "AudioEditor";
    static kEditorTypePattern = "MusicPatternEventEditor";
    /** Browser workspace zone. */
    static kBrowserZone = "BrowserZone";
    /** Arrangement workspace zone. */
    static kArrangementZone = "ArrangementZone";
    /** Instrument channel editor context. */
    static kInstrumentEditor = "Instrument";
    /** Note FX channel editor context. */
    static kNoteFXEditor = "Note FX";

    /**
     * Enable or disable notifications when active editor changes.

     * Example: enable notifications for control surface component
     * ```
     * class MyComponent extends PreSonus.ControlSurfaceComponent
     * {
     *   onInit (hostComponent: Presonus.SurfaceHostComponent)
     *   {
     *     super.onInit (hostComponent);
     *     PreSonus.HostUtils.enableEditorNotifications (this, enable);
     *   }
     * }
     * ```
     *
     * @param observer  Object to be de-/notified about editor changes.
     * @param state  Enable or disable notifications.
     */
    static enableEditorNotifications(observer: unknown, state: boolean) {
        if (state)
            Host.Signals.advise(HostUtils.kEditorSignals, observer);
        else
            Host.Signals.unadvise(HostUtils.kEditorSignals, observer);
    }
    /**
     * Enable or disable engine edit notifications.
     *
     * Example: enable notifications for control surface component
     * ```
     * class MyComponent extends PreSonus.ControlSurfaceComponent
     * {
     *   onInit (hostComponent: Presonus.SurfaceHostComponent)
     *   {
     *     super.onInit (hostComponent);
     *     PreSonus.HostUtils.enableEngineEditNotifications (this, enable);
     *   }
     * }
     * ```
     *
     * @param observer  Object to be de-/notified about engine edit changes.
     * @param state  Enable or disable notifications.
     */
    static enableEngineEditNotifications(observer: unknown, state: boolean) {
        if (state)
            Host.Signals.advise(HostUtils.kEngineEditingSignals, observer);
        else
            Host.Signals.unadvise(HostUtils.kEngineEditingSignals, observer);
    }
    /**
     * Derive active editor type from editor object native class name.
     *
     * Example: get editor type on host editor change notification
     * ```
     * class MyComponent extends PreSonus.ControlSurfaceComponent
     * {
     *   onTrackEditorChangedNotify (editor: any)
     *   {
     *     let editorType = PreSonus.HostUtils.kEditorTypeNone;
     *     if(editor)
     *       editorType = PreSonus.HostUtils.getEditorType (editor);
     *
     *     // Process editor type ...
     *   }
     * }
     * ```
     *
     * @param editor  Current editor object, providing native class name.
     */
    static getEditorType(editor: { nativeClassName: string; }) {
        return editor ? editor.nativeClassName : HostUtils.kEditorTypeNone;
    }
    /**
     * Focus workspace frame in host application.
     *
     * Example: set focus to browser zone immediately.
     * ```
     * class MyComponent extends PreSonus.ControlSurfaceComponent
     * {
     *   focusBrowser ()
     *   {
     *     let deferred = false;
     *     PreSonus.HostUtils.focusWorkspaceFrame (PreSonus.HostUtils.kBrowserZone, deferred);
     *   }
     * }
     * ```
     *
     * @param frameName  Host application UI frame to shift focus to.
     * @param deferred  Shift focus immediately (and wait until done) or deferred.
     */
    static focusWorkspaceFrame(frameName: string, deferred: boolean) {
        if (deferred)
            Host.GUI.Commands.deferCommand("View", "Focus Frame", false, Host.Attributes(["Frame", frameName]));
        else
            Host.GUI.Commands.interpretCommand("View", "Focus Frame", false, Host.Attributes(["Frame", frameName]));
    }
    /**
     * Turn mouse-over mode for recent parameter on/off via host application
     * command "Automation/Mouse-Over".
     *
     * Example:
     * ```
     * class MyComponent extends PreSonus.ControlSurfaceComponent
     * {
     *   onButtonPressed (state: boolean)
     *   {
     *     PreSonus.HostUtils.setParamMouseOverEnabled (state);
     *   }
     * }
     * ```
     *
     * @param state  Enable or disable param mouse over.
     */
    static setParamMouseOverEnabled(state: string) {
        const args: string[] = [];
        args.push("State");
        args.push(state);
        Host.GUI.Commands.interpretCommand("Automation", "Mouse-Over", false, Host.Attributes(args));
    }
    /**
     * Select next or previous device in rack.
     *
     * Example: select next or previous device on encoder value change
     * ```
     * class MyComponent extends PreSonus.ControlSurfaceComponent
     * {
     *   focusInsertsBankElement: PreSonus.InteractiveElement;
     *
     *   onEncoderChanged (value: number)
     *   {
     *     // focusInsertsBankElement previously determined via
     *     // focus bank -> focus channel -> inserts bank
     *
     *     PreSonus.HostUtils.selectNextDevice (this, this.focusInsertsBankElement,
     *       value >= 0.5 ? +1 : -1);
     *   }
     * }
     * ```
     *
     * @param component  Component to set as device focus component.
     * @param bankElement  Controllable providing bank element.
     * @param offset  Slot index offset.
     */
    static selectNextDevice(component: Component, bankElement: BankElement, offset: number) {
        // figure out which slot is open the hard way...
        let slotIndex = -1;
        const slotCount = bankElement.getElementCount();
        for (let i = 0; i < slotCount; i++) {
            const interactiveElement = bankElement.getElement(i);
            if (interactiveElement.getParamValue(PreSonus.ParamID.kInsertEdit)) {
                slotIndex = i;
                break;
            }
        }
        slotIndex += offset;
        if (slotIndex >= 0 && slotIndex < slotCount) {
            const slotElement = bankElement.getElement(slotIndex);
            HostUtils.openEditorAndFocus(component, slotElement);
        }
        /* LATER TODO:
        if(offset > 0)
            bankElement.invokeMethod ("interpretCommand", "Devices", "Next Device in Rack");
        else
            bankElement.invokeMethod ("interpretCommand", "Devices", "Previous Device in Rack");
        */
    }
    /**
     * Open device editor and set ControlLink focus.
     *
     * Example: open instrument editor for focus channel
     * ```
     * class MyComponent extends PreSonus.ControlSurfaceComponent
     * {
     *   onButtonPressed (state: boolean)
     *   {
     *     if(!state)
     *       return;
     *
     *     // Access follow bank via surface model -> root-> lookup XML element by name.
     *     let root = hostComponent.model.root;
     *     let mixerConsoleMappingElement = root.find ("MixerConsoleMapping");
     *     let mixerFollowBankMapping = mixerConsoleMappingElement.find ("MixerFollowBank");
     *     PreSonus.HostUtils.openEditorAndFocus (this, mixerFollowBankMapping.getElement (0),
     *       PreSonus.HostUtils.kInstrumentEditor, true);
     *   }
     * }
     * ```
     *
     * @param component  Component to set as device focus component.
     * @param element  Channel element to open the editor for, has to be connected.
     * @param context  Type of editor to open.
     * @param toggle  Toggle open/close editor if already open.
    */
    static openEditorAndFocus(
        component: Component,
        element: Element,
        context?: string,
        toggle?: boolean) {
        if (!element.isConnected())
            return;
        element.invokeMethod("openEditor", context, toggle);
        if (context == HostUtils.kInstrumentEditor) // special handling for synths
            element.invokeChildMethod("mainSynthSlot", "interpretCommand", "Select Client", component.hostComponent.classID);
        else
            element.invokeMethod("interpretCommand", "Select Client", component.hostComponent.classID);
    }
    /**
     * Make channel visible in host GUI by focussing it.
     *
     * Example: check channel select status, if selected focus it
     * ```
     * class MyComponent extends PreSonus.ControlSurfaceComponent
     * {
     *   onButtonPressed (state: boolean)
     *   {
     *     if(!state)
     *       return;
     *
     *     // ... channelElement from bank
     *     if(channelElement.isAliasConnected (channel.selectValue, PreSonus.ParamID.kSelect))
     *     {
     *       if(channelElement.getParamValue (PreSonus.ParamID.kSelect))
     *         PreSonus.HostUtils.makeChannelVisible (channelElement);
     *     }
     * }
     * ```
     *
     * @param channel  Channel element to focus.
     */
    static makeChannelVisible(channel: { invokeMethod: (method: string) => void; }) {
        channel.invokeMethod("focus");
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * Add Note FX device by device class ID.
     *
     * Example: add 'Chorder' Note FX device
     * ```
     * class MyComponent extends PreSonus.ControlSurfaceComponent
     * {
     *   onButtonPressed (state: boolean)
     *   {
     *     if(!state)
     *       return;
     *
     *     // do not defer, wait for device to be added before opening editor
     *     PreSonus.HostUtils.addNoteFXDevice (PreSonus.DeviceClassID.kNoteFXChorder, false);
     *     let element = <PreSonus.InteractiveElement> this.focusChannelMapping.getElement (0);
     *     if(element)
     *       PreSonus.HostUtils.openEditorAndFocus (this, element, PreSonus.HostUtils.kNoteFXEditor, false);
     *   }
     * }
     * ```
     *
     * @param cid  Note FX device class ID.
     * @param deferred  Perform add command deferred in synchronized.
     */
    static addNoteFXDevice(cid: string, deferred: boolean) {
        const args: string[] = [];
        args.push("cid");
        args.push(cid);
        if (deferred)
            Host.GUI.Commands.deferCommand("Track", "Add Note FX to Selected Tracks", false, Host.Attributes(args));
        else
            Host.GUI.Commands.interpretCommand("Track", "Add Note FX to Selected Tracks", false, Host.Attributes(args));
    }
}

//************************************************************************************************
// ControlSurfaceComponent
//************************************************************************************************
/**
 * Control surface scriptable component class.
 */
class ControlSurfaceComponent {
    interfaces: [typeof Host.Interfaces.IObserver, typeof Host.Interfaces.IParamObserver];
    debugLog: boolean;
    hostComponent: { classID: string; } | null;

    constructor() {
        this.interfaces = [
            Host.Interfaces.IObserver,
            Host.Interfaces.IParamObserver
        ];
        this.debugLog = false;
        this.hostComponent = null;
    }
    /**
     * Component initialization, called by host on surface creation.
     *
     * Example:
     * ```
     * class MyComponent extends PreSonus.ControlSurfaceComponent
     * {
     *    onInit (hostComponent: Presonus.SurfaceHostComponent)
     *    {
     *      super.onInit (hostComponent);
     *      // additional init code
     *    }
     * }
     * ```
     *
     * @param hostComponent  device surface unit, parent host component
     */
    onInit(hostComponent: { classID: string; }) {
        this.hostComponent = hostComponent;
    }
    /**
     * Component exit, called on surface removal or reset.
     *
     * Example:
     * ```
     * class MyComponent extends PreSonus.ControlSurfaceComponent
     * {
     *   onExit ()
     *   {
     *     // additional exit code
     *     super.onExit ();
     *   }
     * }
     * ```
     */
    onExit() {
        this.hostComponent = null;
    }
    /**
     * Log message to host console for debugging, requires debugLog to be enabled.
     *
     * Example: enable debug logging
     * ```
     * class MyComponent extends PreSonus.ControlSurfaceComponent
     * {
     *   onInit (hostComponent: Presonus.SurfaceHostComponent)
     *   {
     *     super.onInit (hostComponent);
     *     this.debugLog = true;
     *     this.log ("Hello World");
     *   }
     * }
     * ```
     *
     * @param message  Text to log.
     */
    log(message: string) {
        if (this.debugLog)
            Host.Console.writeLine(message);
    }
    /**
     * Process a notification.
     *
     * Example: react to 'changed' message alias parameter
     * ```
     * class MyComponent extends PreSonus.ControlSurfaceComponent
     * {
     *   notify (subject: PreSonus.Object, msg: PreSonus.Message)
     *   {
     *     // sanity check sender subject and message are available
     *     if(!subject || !msg)
     *       return;
     *
     *     // typically check for what is signaled and by whom (subject)
     *     // here, an alias parameter signaled a change
     *     if(msg.id == "changed")
     *       if(subject == this.someAliasParam)
     *         // process ...
     *   }
     * }
     * ```
     *
     * @param subject  Message sending object.
     * @param msg  Received message (id and arguments).
     */
    notify(subject: unknown, msg: unknown) { }
    /**
     * Process a parameter change.
     *
     * Example:
     * ```
     * class MyComponent extends PreSonus.ControlSurfaceComponent
     * {
     *   demoParam: PreSonus.Parameter;
     *
     *   onInit (hostComponent: Presonus.SurfaceHostComponent)
     *   {
     *     super.onInit (hostComponent);
     *     this.demoParam = this.hostComponent.paramList.addParam ("demoParam");
     *   }
     *
     *   paramChanged (param: PreSonus.Parameter)
     *   {
     *     if(!param)
     *       return;
     *
     *     // check for a particular parameter
     *     if(param == this.demoParam)
     *       this.log ("demoParam value changed to " + param.value)
     *   }
     * }
     * ```
     *
     * @param param  Changed parameter.
     */
    paramChanged(param: unknown) { }
}

//************************************************************************************************
// PadSectionScriptHandler
// Register with PadSectionComponent::addHandler ()
//************************************************************************************************
class PadSectionScriptHandler {
    interfaces: [];

    constructor() {
        this.interfaces = [];
    }
    /**
     * Activation event handling.
     * @param state  Activate state.
     */
    onActivate(state: boolean) { }
    /**
     * Pad pressed event handling.
     *
     * @param padIndex  Pressed pad index.
     * @param state  Pad pressed state.
     * @param modifiers  Additional pressed modifiers.
     */
    onPadPressed(padIndex: number, state: boolean, modifiers: unknown) { }
}



export const PreSonus = {
    /**
     * Host supported mixer channel types.
     */
    ChannelType: {
        kAudio: "Audio",
        kAudioInput: "AudioInput",
        kAudioOutput: "AudioOutput",
        kAudioTrack: "AudioTrack",
        kAudioSynth: "AudioSynth",
        kAudioGroup: "AudioGroup",
        kAudioEffect: "AudioEffect",
        kAudioSynthBus: "AudioSynthBus",
        kAudioListenBus: "AudioListenBus",
        kAudioAux: "AudioAux",
        kAudioVCA: "AudioVCA",
        kChannelTypeMusic: "Music",
        kChannelTypeMusicTrack: "MusicTrack",
    },

    /**
     * Mixer channel bank names.
     */
    Banks: {
        kAll: "AllBank",
        kScreen: "ScreenBank",
        kRemoteAll: "RemoteAllBank",
        kUser: "RemoteBank",
        AudioInput: "Type:AudioInput",
        AudioOutput: "Type:AudioOutput",
        kAudioTrack: "Type:AudioTrack",
        kAudioSynth: "Type:AudioSynth",
        kAudioBus: "Type:AudioGroup",
        AudioFX: "Type:AudioEffect",
        kAudioVCA: "Type:AudioVCA",
        kAudioAux: "Type:AudioAux",
    },
    /**
     * Control Link remapping hints.
     *
     * ```
     * if(pluginBankElement.remapHint == PreSonus.RemapHint.kFocus)
     *   log ("focus mapping")
     * ```
     */
    RemapHint: {
        /** Plugin focus */
        kFocus: "focus",
        /** Global host focus */
        kGlobal: "global",
    },
    /**
     * Handler roles supported by PadSectionComponent.
     *
     * ```
     * padSectionComponent.addHandlerForRole (PreSonus.PadSectionRole.kMusicInput);
     * ```
     */
    PadSectionRole: {
        /** Musical input. */
        kMusicInput: "musicinput",
        /** Step editing, sequencing. */
        kStepEdit: "stepedit",
        /* Step editing, step parameters. */
        kStepFocus: "stepfocus",
        /** Trigger note repeat rates. */
        kRateTrigger: "ratetrigger",
        /** Bypass or disable pad input. */
        kIdle: "idle",
    },
    /**
     * Step editor supported pad modifiers.
     *
     * ```
     * padSectionComponent.setModifierActive (true, PreSonus.PadModifier.kStepBinding);
     * ```
     */
    PadModifier: {
        /** Set step to accented. */
        kAccentedStep: 0,
        0: "kAccentedStep",
        /** Use step binding to concatenate multiple steps. */
        kStepBinding: 1,
        1: "kStepBinding",
    },

    PadSection,

    /**
     * Pad section music input pad handler display mode.
     *
     * ```
     * let musicInputHandler = <PreSonus.PadSectionMusicInputHandler> component.getHandler (mode);
     * musicInputHandler.setDisplayMode (PreSonus.MusicPadDisplayMode.kBrightColors);
     * ```
     */
    MusicPadDisplayMode: {
        kBrightColors: "brightcolors",
        kDimmedColors: "dimmedcolors",
        kNoColors: "nocolors",
    },

    /**
     * Common parameter IDs.
     *
     * ```
     * let labelParam = component.findParameter (PreSonus.ParamID.kLabel);
     * ```
     */
    ParamID: {
        // Channel
        kLabel: "label",
        kSelect: "selected",
        kMultiSelectMode: "multiselect",
        kColor: "color",
        kNumber: "number",
        kVolume: "volume",
        kPan: "pan",
        kRecord: "recordArmed",
        kAutoMode: "automationMode",
        kInsertBypass: "Inserts/bypassAll",
        kSendBypass: "Sends/bypassAll",
        kInputFxGain: "InputFX/gain",
        // AudioClick
        kAudioClickOn: "AudioClick/on",
        kAudioClickGain: "AudioClick/gain",
        // Inserts
        kInsertName: "@owner/deviceName",
        kInsertEdit: "@owner/edit",
        // Sends
        kSendPort: "sendPort",
        kSendLevel: "sendlevel",
        kSendMute: "sendMute",
        // Cues
        kCueMixDestination: "destination",
        kCueMixLevel: "level",
        // ControlLink
        kFocusBypass: "@global/Editor/focusBypass",
        kFocusAutoMode: "@global/Editor/focusAutomationMode",
        kTitle: "title",
        kValue: "value",
        // Macro Controls
        kMacroTitle: "title",
        kMacroValue: "pilot",
        /** Browser: focus node title, as alias */
        kBrowserFocusNode: "focusNode",
        /** Browser: focus node parent title, as alias */
        kBrowserFocusNodeParent: "focusNodeParent",
        /** Browser: focus node is expandable or not, as alias */
        kBrowserFocusNodeExpandable: "focusNodeExpandable",
        /** Paging: component page number (not an index). */
        kPagingPageNumber: "pageNumber",
        /** Paging: max pages count */
        kPagingPageCount: "pageCount",
        /** Paging: combined paging status string */
        kPagingStatus: "pagingStatus",
        /** Paging: paging status format */
        kPagingStatusFormat: "pagingStatusFormat",
        /** Paging mode: single, multi, auto */
        kPagingMode: "pagingMode",
        /** Paging: trigger next page */
        kPagingNextPage: "nextPage",
        /** Paging: trigger previous page */
        kPagingPreviousPage: "prevPage",
        // Editor
        kEditorFocusDeviceName: "focusDeviceName",
        kFocusDeviceFullName: "focusDeviceFullName",
        kFocusDeviceFolder: "focusDeviceFolder",
        kEditorFocusBypass: "focusBypass",
        kFocusAutomationMode: "focusAutomationMode",
        kFocusPresetName: "focusPresetName"
    },

    /**
     * Host object properties
     **/
    PropertyID: {
        // Channel
        kChannelType: "channelType"
    },

    /**
     * Control Link paging modes.
     */
    PagingMode: {
        0: "kSingle",
        kSingle: 0,
        1: "kMulti",
        kMulti: 1,
        2: "kAuto",
        kAuto: 2
    },

    /**
     * Host component IDs.
     *
     * ```
     * let pagingComponent = hostComponent.find (PreSonus.ComponentID.kPaging);
     * ```
     */
    ComponentID: {
        /** PagingComponent ID */
        kPaging: "Editor/Paging",
        /** EditComponent ID */
        kEditor: "Editor"
    },

    /**
     * Host device class IDs.
     *
     * ```
     * PreSonus.HostUtils.addNoteFXDevice (PreSonus.DeviceClassID.kNoteFXChorder, false);
     * ```
     */
    DeviceClassID: {
        /** NoteFX device 'Chorder' CID. */
        kNoteFXChorder: "{D2D9B002-12FC-4F1D-AFDA-70336D1DC108}",
        /** NoteFX device 'Arpeggiator' CID. */
        kNoteFXArpeggiator: "{BDD2D6E5-3819-41B4-BF91-7B832DAAFA0B}",
        /** 'Impact' instrument CID. */
        kInstrumentImpact: "{3713E26C-2FCA-4024-9F25-17E9D2BE2B9B}",
        /** 'SampleOne' instrument CID. */
        kInstrumentSampleOne: "{C37BC9D1-6BD1-46A7-A60C-B13438666448}"
    },


    /**
     * Host device folder IDs.
     *
     * ```
     * let maxSendCount = mixerConsole.audioMixer.getMaxSlotCount (PreSonus.FolderID.kSendsFolder);
     * ```
     */
    FolderID: {
        /** Channel Sends Folder. */
        kSendsFolder: "Sends",
        /** Channel CueMix Folder. */
        kCueMixFolder: "CueMix"
    },

    NoteRepeat,

    HostUtils,

    ControlSurfaceComponent,

    PadSectionScriptHandler
};
