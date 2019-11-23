const PersistenceLogInputOutput = require('./persistence/persistenceLogInputOutput');
const RecoveryNeededProcessesResolver = require('./resolving/recoveryNeededProcessesResolver');
const RecoveryOutdatedSignalsResolver = require('./resolving/recoveryOutdatedSignalsResolver');
const SignalUpToDateChecker = require('./resolving/signalUpToDateChecker');
const CachingSignalUpToDateChecker = require('./resolving/cachingSignalUpToDateChecker');
const fs = require('fs');


function resolveNeededTasks(traceFile, outputTraceFile, dataDirectoryOverride = undefined, outdatedSignalsFile = undefined) {
    const persistenceLogInputOutput = new PersistenceLogInputOutput();
    const traceJsonList = parseJsonLinesFile(traceFile);
    const trace = persistenceLogInputOutput.getPersistenceFromJsonList(traceJsonList);

    const signalChecker = new SignalUpToDateChecker(trace.getWorkDir(), dataDirectoryOverride);
    const signalUpToDateChecker = new CachingSignalUpToDateChecker(signalChecker);
    const recoveryNeededProcessesResolver = new RecoveryNeededProcessesResolver(signalUpToDateChecker);
    const recoveryOutdatedSignalsResolver = new RecoveryOutdatedSignalsResolver();
    recoveryNeededProcessesResolver.resolveOutdatedProcesses(trace);

    if (outdatedSignalsFile !== undefined) {
        const outdatedSignalsJsonList = parseJsonLinesFile(outdatedSignalsFile);
        const outdatedSignals = outdatedSignalsJsonList
            .map(signalJson => {
                return persistenceLogInputOutput.parseSignalPersistence(signalJson, undefined).signalIdentifier;
            });
        recoveryOutdatedSignalsResolver.resolveOutdatedSignals(trace, outdatedSignals);
    }

    const resultJsonList = persistenceLogInputOutput.getResolvedTraceLogJsonList(trace);
    writeLogFile(outputTraceFile, resultJsonList);
}

function parseJsonLinesFile(path) {
    const lines = [];
    fs.readFileSync(path, 'utf8')
        .trim()
        .split("\n")
        .forEach(line => lines.push(JSON.parse(line)));
    return lines;
}

function writeLogFile(file, jsonLines) {
    fs.writeFileSync(file, "");
    for (var i = 0; i < jsonLines.length; i++) {
        let line = JSON.stringify(jsonLines[i]);
        if (i < jsonLines.length - 1) {
            line = line + "\n";
        }
        fs.appendFile(file, line, 'utf8', logFileWriteCallback);
    }
}

function logFileWriteCallback(err) {
    if (err) {
        console.log(err)
    }
}

module.exports.resolveNeededTasks = resolveNeededTasks;
