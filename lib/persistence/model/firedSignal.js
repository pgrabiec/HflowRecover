function FiredSignal(signalName, signalIdentifier, targetProcesses = [], sourceProcess, workDir) {
    this.name = signalName;
    this.signalIdentifier = signalIdentifier;
    this.targetProcesses = targetProcesses;
    this.sourceProcess = sourceProcess;
    this.workDir = workDir
}

FiredSignal.prototype.getSourceProcessIdentifier = function () {
    return this.signalIdentifier.sourceProcessIdentifier;
};

module.exports = FiredSignal;
