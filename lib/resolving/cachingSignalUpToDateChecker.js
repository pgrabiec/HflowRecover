function CachingSignalUpToDateChecker(actualChecker) {
    this.actualChecker = actualChecker;
    this.upToDateSignalIdentifiers = new Set([]);
}

CachingSignalUpToDateChecker.prototype.isSignalUpToDate = function (signal) {
    if (this.upToDateSignalIdentifiers.has(signal.signalIdentifier)) {
        return true;
    }
    const isUpToDate = this.actualChecker.isSignalUpToDate(signal);
    if (isUpToDate) {
        this.upToDateSignalIdentifiers.add(signal.signalIdentifier);
    }
    return isUpToDate;
};

module.exports = CachingSignalUpToDateChecker;
