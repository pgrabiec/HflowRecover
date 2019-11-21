const FiredProcess = require('./model/firedProcess');
const FiredSignal = require('./model/firedSignal');
const ExecutionTrace = require('./model/executionTrace');
const SignalIdentifier = require('./model/signalIdentifier');
const ProcessIdentifier = require('./model/processIdentifier');

function PersistenceLogInputOutput() {
}

PersistenceLogInputOutput.prototype.getPersistenceFromJsonList = function (traceLogJsonList) {
    const firedSignalsMap = {};
    const firedProcessIdentifierToOriginalMetadata = new Map();

    const infos = this.filterPersistenceEntriesByType(traceLogJsonList, "info");
    const inputs = this.filterPersistenceEntriesByType(traceLogJsonList, "input")
        .map(inputEntry => this.parseSignalPersistence(inputEntry["1"][2], undefined));
    inputs.forEach(inputSignal => firedSignalsMap[inputSignal.signalIdentifier] = inputSignal);

    const firedProcesses = this.filterPersistenceEntriesByType(traceLogJsonList, "fired")
        .map(firedProcessEntry => {
            const process = this.parseFiredProcess(firedProcessEntry, firedSignalsMap);
            firedProcessIdentifierToOriginalMetadata.set(process.processIdentifier, firedProcessEntry);
            return process;
        });
    return new ExecutionTrace(infos, inputs, firedProcesses, Object.values(firedSignalsMap), firedProcessIdentifierToOriginalMetadata);
};

PersistenceLogInputOutput.prototype.filterPersistenceEntriesByType = function (entries, desiredType) {
    return entries.filter(entry => {
        return entry["1"][0] === desiredType;
    })
};

PersistenceLogInputOutput.prototype.parseFiredProcess = function (persistenceProcessEntry, firedSignals) {
    const processId = persistenceProcessEntry["1"][2];
    const processInstanceId = persistenceProcessEntry["1"][3];

    const inputSignals = [];
    const outputSignals = [];
    const firedProcess = new FiredProcess(new ProcessIdentifier(processId, processInstanceId), inputSignals, outputSignals);

    persistenceProcessEntry["1"][4]
        .map(signalPersistence => PersistenceLogInputOutput.prototype.parseSignalPersistence(signalPersistence, firedProcess))
        .forEach(outputSignal => {
            firedSignals[outputSignal.signalIdentifier] = outputSignal;
            outputSignals.push(outputSignal)
        });

    persistenceProcessEntry["1"][5]
        .map(signalPersistence => PersistenceLogInputOutput.prototype.parseSignalPersistence(signalPersistence, firedProcess))
        .forEach(inputSignal => {
            const inputSignalIdentifier = inputSignal.signalIdentifier;
            if (inputSignalIdentifier.sourceProcessIdentifier.id !== undefined) {
                // Removing this extra property in order to get a match with a potential already fired signal
                inputSignalIdentifier.instanceId = undefined;
            }
            let inputSignalToUse = firedSignals[inputSignalIdentifier];
            if (inputSignalToUse === undefined) {
                // this input signal for this process is not saved as fired yet - we need to register it
                inputSignalToUse = inputSignal;
                firedSignals[inputSignalToUse.signalIdentifier] = inputSignalToUse
            }
            inputSignals.push(inputSignalToUse);
            inputSignalToUse.targetProcesses.push(firedProcess);
        });

    return firedProcess;
};

PersistenceLogInputOutput.prototype.parseSignalPersistence = function (persistenceSignalEntry, sourceProcess) {
    const name = persistenceSignalEntry.name;
    const sourceProcessIdentifier = new ProcessIdentifier(persistenceSignalEntry.source, persistenceSignalEntry.firingId);
    const identifier = new SignalIdentifier(persistenceSignalEntry._id, persistenceSignalEntry.sigIdx, sourceProcessIdentifier);
    return new FiredSignal(name, identifier, [], sourceProcess);
};

PersistenceLogInputOutput.prototype.getResolvedTraceLogJsonList = function (resolvedExecutionTrace) {
    const jsonList = [];
    resolvedExecutionTrace.infos.forEach(info => jsonList.push(info));
    resolvedExecutionTrace.inputs.forEach(input => jsonList.push(input));
    resolvedExecutionTrace.firedProcesses.map(process => {
        const processMetadata = resolvedExecutionTrace.firedProcessIdentifierToOriginalMetadata.get(process.processIdentifier);
        const info = process.outdatedInfo;
        if (info !== undefined) {
            processMetadata["2"] = {
                "flags": ["forceRetry"],
                "missingOutputs": info.missingOutputs.map(signal => signal.signalIdentifier.id),
                "missingInputs": info.missingInputs.map(signal => signal.signalIdentifier.id)
            };
        }
        return processMetadata;
    }).forEach(process => jsonList.push(process));
    return jsonList;
};

module.exports = PersistenceLogInputOutput;
