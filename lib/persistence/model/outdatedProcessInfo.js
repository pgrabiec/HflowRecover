function OutdatedProcessInfo() {
    this.flags = new Set();
    this.missingInputs = new Set();
    this.missingOutputs = new Set();
}

OutdatedProcessInfo.prototype.addFlag = function (flag) {
    this.flags.add(flag);
};

OutdatedProcessInfo.prototype.hasFlag = function (flag) {
    this.flags.has(flag);
};

OutdatedProcessInfo.prototype.addMissingInput = function (missingInput) {
    this.missingInputs.add(missingInput);
};

OutdatedProcessInfo.prototype.addMissingInputs = function (missingInputs) {
    missingInputs.forEach(input => this.missingInputs.add(input));
};

OutdatedProcessInfo.prototype.addMissingOutput = function (missingOutput) {
    this.missingOutputs.add(missingOutput);
};

OutdatedProcessInfo.prototype.addMissingOutputs = function (missingOutputs) {
    missingOutputs.forEach(output => this.missingOutputs.add(output));
};

OutdatedProcessInfo.prototype.FLAG_FORCE_RETRY = "forceRetry";
OutdatedProcessInfo.prototype.FLAG_OUTDATED_INPUT = "outdatedInput";
OutdatedProcessInfo.prototype.FLAG_OUTDATED_OUTPUT = "outdatedOutput";

module.exports = OutdatedProcessInfo;
