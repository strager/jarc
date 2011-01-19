(function () {
    var assert = require('assert');
    var OutboundMessageStream = require('jarc/OutboundMessageStream').$;

    exports.emitsDataOnWrite = function () {
        var stream = new OutboundMessageStream();

        var dataArgument;

        stream.on('data', function (data) {
            dataArgument = data;
        });

        stream.write({
            command: 'PING',
            parameters: [ 'Hello, are you there?' ]
        });

        assert.equal(dataArgument, 'PING :Hello, are you there?\r\n');
    };

    exports.emitsErrorOnBadMessage = function () {
        var stream = new OutboundMessageStream();

        var emitted = false;

        stream.on('error', function () {
            emitted = true;
        });

        stream.write({
            command: 'I am a rebel'
        });

        assert.equal(emitted, true);
    };
}());
