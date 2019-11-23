const OutdatedProcessInfo = require('./outdatedProcessInfo');

function FiredProcess(processIdentifier, inputSignals = [], outputSignals = []) {
    this.processIdentifier = processIdentifier;
    this.inputSignals = inputSignals;
    this.outputSignals = outputSignals;
    this.outdatedInfo = new OutdatedProcessInfo();
}

module.exports = FiredProcess;
