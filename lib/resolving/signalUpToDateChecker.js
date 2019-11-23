const fs = require('fs');
const path = require('path');

function SignalUpToDateChecker(workflowDirectory, dataDirectoryOverride = undefined) {
    this.workflowDirectory = workflowDirectory;
    this.dataDirectoryOverride = dataDirectoryOverride;
}

SignalUpToDateChecker.prototype.isSignalUpToDate = function (signal) {
    const dataDirectory = this.resolveDataDirectory(signal);
    const filePath = path.join(dataDirectory, signal.name);
    return fs.existsSync(filePath);
};

SignalUpToDateChecker.prototype.resolveDataDirectory = function (signal) {
    let directory = this.dataDirectoryOverride;
    if (directory === undefined) {
        directory = signal.workDir;
    }
    if (directory === undefined) {
        directory = this.workflowDirectory;
    }
    return directory;
};

module.exports = SignalUpToDateChecker;
