const WorkflowExecutionTraceDto = require('./persistence/model/executionTrace');
const PersistenceLogInputOutput = require('./persistence/persistenceLogInputOutput');
const RecoveryNeededProcessesResolver = require('./resolving/recoveryNeededProcessesResolver');
const SignalUpToDateChecker = require('./resolving/signalUpToDateChecker');
const fs = require('fs');


function resolveNeededTasks(traceFile, outputTraceFile) {
    const persistenceLogInputOutput = new PersistenceLogInputOutput();
    const traceJsonList = parseLogFile(traceFile);
    const trace = persistenceLogInputOutput.getPersistenceFromJsonList(traceJsonList);

    const signalUpToDateChecker = new SignalUpToDateChecker();
    const recoveryNeededProcessesResolver = new RecoveryNeededProcessesResolver(signalUpToDateChecker);

    recoveryNeededProcessesResolver.resolveOutdatedProcesses(trace);
    const resultJsonList = persistenceLogInputOutput.getResolvedTraceLogJsonList(trace);
    writeLogFile(outputTraceFile, resultJsonList);
}

function parseLogFile(recoveryFile) {
    const lines = [];
    fs.readFileSync(recoveryFile, 'utf8')
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
