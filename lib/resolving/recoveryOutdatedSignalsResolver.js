const OutdatedProcessInfo = require('../persistence/model/outdatedProcessInfo');

function RecoveryOutdatedSignalsResolver() {
}

RecoveryOutdatedSignalsResolver.prototype.resolveOutdatedSignals = function (trace, outdatedSignalIdentifiers) {
    const outdatedSignalsToVisit = this.resolveOutdatedSignalsObjects(trace, outdatedSignalIdentifiers);
    const addedSignalIdentifiers = new Set(outdatedSignalsToVisit.map(signal => signal.signalIdentifier));
    while (outdatedSignalsToVisit.length > 0) {
        const outdatedSignal = outdatedSignalsToVisit.pop();
        const outdatedSignalIdentifier = outdatedSignal.signalIdentifier;

        // Add the signal id to target's missing inputs
        outdatedSignal.targetProcesses.forEach(targetProcess => {
            targetProcess.outdatedInfo.addMissingInput(outdatedSignalIdentifier)
        });

        // Propagate for processes not yet marked with outdated input flag
        outdatedSignal.targetProcesses
            .filter(targetProcess => {
                return !targetProcess.outdatedInfo.hasFlag(OutdatedProcessInfo.prototype.FLAG_OUTDATED_INPUT)
            })
            .forEach(targetProcess => {
                const outdatedInfo = targetProcess.outdatedInfo;
                outdatedInfo.addFlag(OutdatedProcessInfo.prototype.FLAG_OUTDATED_INPUT);
                outdatedInfo.addFlag(OutdatedProcessInfo.prototype.FLAG_FORCE_RETRY);
                const outputSignals = targetProcess.outputSignals;
                outputSignals
                    .filter(signal => {
                        return !addedSignalIdentifiers.has(signal.signalIdentifier)
                    })
                    .forEach(signal => {
                        const signalIdentifier = signal.signalIdentifier;
                        outdatedSignalsToVisit.push(signal);
                        addedSignalIdentifiers.add(signalIdentifier);
                        outdatedInfo.addMissingOutput(signalIdentifier);
                    })

            });
    }
};

RecoveryOutdatedSignalsResolver.prototype.resolveOutdatedSignalsObjects = function (trace, outdatedSignalIdentifiers) {
    const outdatedSignalsIdentifiersStringSet = new Set(outdatedSignalIdentifiers.map(id => id.toString()));
    return trace.firedSignals.filter(signal => outdatedSignalsIdentifiersStringSet.has(signal.signalIdentifier.toString()));
};

module.exports = RecoveryOutdatedSignalsResolver;
