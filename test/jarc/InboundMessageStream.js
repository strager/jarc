(function () {
    var assert = require('assert');
    var InboundMessageStream = require('jarc/InboundMessageStream').$;

    exports.messageOnWrite = function () {
        var stream = new InboundMessageStream();

        var messageArgument;

        stream.on('message', function (message) {
            messageArgument = message;
        });

        stream.write('PING :Hello, are you there?\r\n');

        assert.deepEqual(messageArgument, {
            prefixString: null,
            command: 'PING',
            parameters: [ 'Hello, are you there?' ]
        });
    };

    exports.doesNotEmitIncompleteMessage = function () {
        var stream = new InboundMessageStream();

        var emitted = false;

        stream.on('message', function () {
            emitted = true;
        });

        stream.write('PING :incomplete D=');

        assert.equal(emitted, false);
    };

    exports.multipleMessagesOnSplitWrite = function () {
        var stream = new InboundMessageStream();

        var messages = [ ];

        stream.on('message', function (message) {
            messages.push(message);
        });

        stream.write('PING :');
        stream.write('Hello, are you there?\r');
        stream.write('\n:prefix I <3 you\r\n');

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
    };

    exports.errorOnBadWrite = function () {
        var stream = new InboundMessageStream();

        var emitted = false;

        stream.on('error', function () {
            emitted = true;
        });

        stream.write(':PrefixOnlyMessage\r\n');

        assert.equal(emitted, true);
    };
}());
