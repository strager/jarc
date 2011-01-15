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
        },

        doesNotEmitIncompleteMessage: function () {
            var stream = new MessageStream();

            var emitted = false;

            stream.inbound.on('message', function () {
                emitted = true;
            });

            stream.inbound.write('PING :incomplete D=');

            assert.equal(emitted, false);
        },

        emitsMultipleMessagesOnSplitWrite: function () {
            var stream = new MessageStream();

            var messages = [ ];

            stream.inbound.on('message', function (message) {
                messages.push(message);
            });

            stream.inbound.write('PING :');
            stream.inbound.write('Hello, are you there?\r');
            stream.inbound.write('\n:prefix I <3 you\r\n');

            assert.deepEqual(messages, [
                {
                    prefixString: null,
                    command: 'PING',
                    parameters: [ 'Hello, are you there?' ]
                },
                {
                    prefixString: 'prefix',
                    command: 'I',
                    parameters: [ '<3', 'you' ]
                }
            ]);
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
