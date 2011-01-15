(function () {
    var assert = require('assert');
    var MessageStream = require('jarc/MessageStream').$;

    exports.inbound = {
        emitsMessageOnWrite: function () {
            var stream = new MessageStream();

            var messageArgument;

            stream.inbound.on('message', function (message) {
                messageArgument = message;
            });

            stream.inbound.write('PING :Hello, are you there?\r\n');

            assert.deepEqual(messageArgument, {
                prefixString: null,
                command: 'PING',
                parameters: [ 'Hello, are you there?' ]
            });
        }
    };

    exports.outbound = {
        emitsDataOnWrite: function () {
            var stream = new MessageStream();

            var dataArgument;

            stream.outbound.on('data', function (data) {
                dataArgument = data;
            });

            stream.outbound.write({
                command: 'PING',
                parameters: [ 'Hello, are you there?' ]
            });

            assert.equal(dataArgument, 'PING :Hello, are you there?\r\n');
        }
    };
}());
