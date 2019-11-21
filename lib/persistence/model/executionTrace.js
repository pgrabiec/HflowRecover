function ExecutionTrace(infos, inputs, firedProcesses, firedSignals, firedProcessIdentifierToOriginalMetadata) {
    this.infos = infos;
    this.inputs = inputs;
    this.firedProcesses = firedProcesses;
    this.firedSignals = firedSignals;
    this.firedProcessIdentifierToOriginalMetadata = firedProcessIdentifierToOriginalMetadata;
}

module.exports = ExecutionTrace;
