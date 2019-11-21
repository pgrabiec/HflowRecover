function FiredProcess(processIdentifier, inputSignals = [], outputSignals = [], outdatedInfo = undefined) {
    this.processIdentifier = processIdentifier;
    this.inputSignals = inputSignals;
    this.outputSignals = outputSignals;
    this.outdatedInfo = outdatedInfo
}

module.exports = FiredProcess;
