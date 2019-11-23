const OutdatedProcessInfo = require('../persistence/model/outdatedProcessInfo');


function RecoveryNeededProcessesResolver(signalChecker) {
    this.signalChecker = signalChecker;
}

RecoveryNeededProcessesResolver.prototype.resolveOutdatedProcesses = function (trace) {
    const outdatedProcessesToVisit = this.resolveTerminalOutdatedProcesses(trace, this.signalChecker);
    const outdatedProcessIdentifiers = new Set(outdatedProcessesToVisit.map(process => process.processIdentifier));
    while (outdatedProcessesToVisit.length > 0) {
        const outdatedProcess = outdatedProcessesToVisit.pop();
        const outdatedInputs = outdatedProcess.inputSignals.filter(signal => !this.signalChecker.isSignalUpToDate(signal));
        const outdatedOutputs = outdatedProcess.outputSignals.filter(signal => !this.signalChecker.isSignalUpToDate(signal));
        outdatedProcess.outdatedInfo.addMissingInputs(outdatedInputs.map(signal => signal.signalIdentifier));
        outdatedProcess.outdatedInfo.addMissingOutputs(outdatedOutputs.map(signal => signal.signalIdentifier));
        outdatedProcess.outdatedInfo.addFlag(OutdatedProcessInfo.prototype.FLAG_FORCE_RETRY);
        outdatedInputs.map(outdatedInput => outdatedInput.sourceProcess)
            .filter(process => process !== undefined)
            .forEach(sourceOfOutdatedSignal => {
                const outdatedSourceProcessIdentifier = sourceOfOutdatedSignal.processIdentifier;
                if (outdatedProcessIdentifiers.has(outdatedSourceProcessIdentifier)) {
                    return
                }
                outdatedProcessIdentifiers.add(outdatedSourceProcessIdentifier);
                outdatedProcessesToVisit.push(sourceOfOutdatedSignal);
            });
    }
};

/**
 * Returns Array of all processes that produced all the terminal signals (signals having no target processes)
 * that are not up-to-date
 * */
RecoveryNeededProcessesResolver.prototype.resolveTerminalOutdatedProcesses = function (trace, signalUpToDateChecker) {
    return trace.firedSignals
        .filter(signal => signal.targetProcesses.length === 0)
        .filter(signal => !signalUpToDateChecker.isSignalUpToDate(signal))
        .map(signal => signal.sourceProcess);
};

module.exports = RecoveryNeededProcessesResolver;
