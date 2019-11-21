function OutdatedProcessInfo(processIdentifier, missingInputs, missingOutputs) {
    this.missingInputs = missingInputs;
    this.missingOutputs = missingOutputs;
}

module.exports = OutdatedProcessInfo;
