export const Host = {
    Signals: {
        advise(signal: string, observer: any) { },
        unadvise(signal: string, observer: any) { },
    },
    GUI: {
        Commands: {
            deferCommand(command: string, description: string, flag: boolean, attributes: string[]): void { },
            interpretCommand(command: string, description: string, flag: boolean, attributes: string[]): void { },
        },
    },
    Interfaces: {
        IObserver: {},
        IParamObserver: {},
    },
    Attributes: (args: string[]): string[] => { return []; },
    Console: {
        writeLine(message: string): void { },
    },
};
