const ProcessIdentifier = require('./processIdentifier');

function SignalIdentifier(id, instanceId = undefined, sourceProcessIdentifier = new ProcessIdentifier(undefined, undefined)) {
    this.id = id;
    this.instanceId = instanceId;
    this.sourceProcessIdentifier = sourceProcessIdentifier
}

SignalIdentifier.prototype.toString = function () {
    return JSON.stringify(this);
};

module.exports = SignalIdentifier;
