function ExecutionTrace(infos, inputSignalsMetadata, firedProcesses, firedSignals, firedProcessIdentifierToOriginalMetadata) {
    this.infos = infos;
    this.inputSignalsMetadata = inputSignalsMetadata;
    this.firedProcesses = firedProcesses;
    this.firedSignals = firedSignals;
    this.firedProcessIdentifierToOriginalMetadata = firedProcessIdentifierToOriginalMetadata;
}

ExecutionTrace.prototype.getWorkDir = function () {
    if (this.infos.length < 1) {
        return undefined;
    }
    return this.infos[0]["1"][1];
};

module.exports = ExecutionTrace;
