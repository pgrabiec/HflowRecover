const ProcessIdentifier = require('./processIdentifier');

function SignalIdentifier(id = undefined, instanceId = undefined, sourceProcessIdentifier = undefined, name = undefined) {
    this.id = id;
    this.instanceId = instanceId;
    this.sourceProcessIdentifier = sourceProcessIdentifier;
    this.name = name;
}

SignalIdentifier.prototype.toString = function () {
    return JSON.stringify(this);
};

SignalIdentifier.prototype.equals = function (other) {
    return this.id === other.id
        && this.instanceId === other.instanceId
        && this.sourceProcessIdentifier.equals(other.sourceProcessIdentifier)
        && this.name === other.name;
};

module.exports = SignalIdentifier;
