(function () {
    var assert = require('assert');
    var Message = require('jarc/Message');

    exports.fromRawString = {
        simple: function () {
            var message = Message.fromRawString('PING data');

            assert.strictEqual(message.prefixString, null);
            assert.equal(message.command, 'PING');
            assert.deepEqual(message.parameters, [ 'data' ]);
        },

        complex: function () {
            var message = Message.fromRawString(':~a!b@c.d PRIVMSG rec :message goes here');

            assert.equal(message.prefixString, '~a!b@c.d');
            assert.equal(message.command, 'PRIVMSG');
            assert.deepEqual(message.parameters, [ 'rec', 'message goes here' ]);
        }
    };

    exports.toRawString = {
        simple: function () {
            var message = {
                prefix: null,
                command: 'PING',
                parameters: [ 'data' ]
            };

            assert.equal(Message.toRawString(message), 'PING :data');
        }
    };
}());
