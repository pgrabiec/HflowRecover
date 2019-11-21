function ProcessIdentifier(id, instanceId) {
    this.id = id;
    this.instanceId = instanceId;
}

ProcessIdentifier.prototype.toString = function () {
    return JSON.stringify(this);
};

module.exports = ProcessIdentifier;
