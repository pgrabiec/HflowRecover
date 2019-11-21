const chai = require('chai');
const assert = chai.assert;
const chaiExclude = require('chai-exclude');
chai.use(chaiExclude);
const PersistenceLogInputOutput = require('../lib/persistence/persistenceLogInputOutput');
const FiredProcess = require('../lib/persistence/model/firedProcess');
const FiredSignal = require('../lib/persistence/model/firedSignal');
const ExecutionTrace = require('../lib/persistence/model/executionTrace');
const SignalIdentifier = require('../lib/persistence/model/signalIdentifier');
const ProcessIdentifier = require('../lib/persistence/model/processIdentifier');

describe('PersistenceLogInputOutput', function () {
    it('Should parse persistence log correctly', function () {
        // given
        const persistenceLogInputOutput = new PersistenceLogInputOutput();
        const signal1Metadata = {
            "name": "input1",
            "_id": 6,
            "data": [{}],
            "sigIdx": 7
        };
        const signal2Metadata = {
            "name": "output1",
            "workdir": "workdir1",
            "_id": 4,
            "source": 2,
            "firingId": 5
        };
        const signal3Metadata = {
            "name": "output2",
            "workdir": "workdir2",
            "_id": 10,
            "source": 8,
            "firingId": 11
        };
        const traceLogJsonList = [
            {
                "0": "Date1",
                "1": ["input", 1, signal1Metadata]
            },
            {
                "0": "Date2",
                "1": ["fired", 1, 2, 3, [signal2Metadata], [signal1Metadata]]
            },
            {
                "0": "Date3",
                "1": ["fired", 1, 8, 9, [signal3Metadata], [signal2Metadata]]
            }
        ];

        // when
        const parsed = persistenceLogInputOutput.getPersistenceFromJsonList(traceLogJsonList);

        // then
        const process1 = new FiredProcess(new ProcessIdentifier(2, 3), [], []);
        const process2 = new FiredProcess(new ProcessIdentifier(8, 9), [], []);

        const signal1 = new FiredSignal("input1", new SignalIdentifier(6, 7), [process1], undefined);
        const signal2 = new FiredSignal("output1", new SignalIdentifier(4, undefined, new ProcessIdentifier(2, 5)), [process2], process1);
        const signal3 = new FiredSignal("output2", new SignalIdentifier(10, undefined, new ProcessIdentifier(8, 11)), [], process2);

        process1.inputSignals.push(signal1);
        process1.outputSignals.push(signal2);
        process2.inputSignals.push(signal2);
        process2.outputSignals.push(signal3);

        const expectedProcessIdentifierToOriginalMetadata = new Map([
            [process1.processIdentifier, traceLogJsonList[1]],
            [process2.processIdentifier, traceLogJsonList[2]]
        ]);
        const expectedTrace = new ExecutionTrace([], [signal1], [process1, process2], [signal1, signal2, signal3], expectedProcessIdentifierToOriginalMetadata);
        assert.deepStrictEqual(parsed, expectedTrace);
    });
});
