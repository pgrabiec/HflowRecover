function FiredSignal(signalName, signalIdentifier, targetProcesses = [], sourceProcess) {
    this.name = signalName;
    this.signalIdentifier = signalIdentifier;
    this.targetProcesses = targetProcesses;
    this.sourceProcess = sourceProcess;
}

FiredSignal.prototype.getSourceProcessIdentifier = function () {
    return this.signalIdentifier.sourceProcessIdentifier;
};

module.exports = FiredSignal;
