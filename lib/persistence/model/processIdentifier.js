function ProcessIdentifier(id, instanceId) {
    this.id = id;
    this.instanceId = instanceId;
}

ProcessIdentifier.prototype.toString = function () {
    return JSON.stringify(this);
};

ProcessIdentifier.prototype.equals = function (other) {
    return this.id === other.id
        && this.instanceId === other.instanceId;
};

ProcessIdentifier.prototype.isEmpty = function () {
    return this.id !== undefined
        && this.instanceId !== undefined
};

module.exports = ProcessIdentifier;
