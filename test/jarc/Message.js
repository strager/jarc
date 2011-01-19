(function () {
    var assert = require('assert');
    var massert = require('test/massert');
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
        },

        prefixOnlyThrows: function () {
            massert.throws(function () {
                Message.fromRawString(':ImJustAPrefixBro');
            });

            massert.throws(function () {
                Message.fromRawString(':ImJustAPrefixBro  ');
            });
        },
    };

    exports.toRawString = {
        simple: function () {
            var message = {
                command: 'PING',
                parameters: [ 'data' ]
            };

            assert.equal(Message.toRawString(message), 'PING :data');
        },

        complex: function () {
            var message = {
                prefixString: '~a!b@c.d',
                command: 'PRIVMSG',
                parameters: [ 'rec', 'message goes here' ]
            };

            assert.equal(Message.toRawString(message), ':~a!b@c.d PRIVMSG rec :message goes here');
        },

        noParameters: function () {
            var message = {
                command: 'PING'
            };

            assert.equal(Message.toRawString(message), 'PING');
        },

        emptyParameters: function () {
            var message = {
                command: 'PING',
                parameters: [ ]
            };

            assert.equal(Message.toRawString(message), 'PING');
        },

        emptyLastParameter: function () {
            var message = {
                command: 'PING',
                parameters: [ 'this', 'is', 'a', 'test', '' ]
            };

            assert.equal(Message.toRawString(message), 'PING this is a test :');
        },

        spaceInPrefixThrows: function () {
            var message = {
                prefixString: 'omg invalid',
                command: 'PING',
                parameters: [ 'data' ]
            };

            massert.throws(function () {
                Message.toRawString(message);
            });
        },

        emptyCommandThrows: function () {
            var message = {
                command: '',
                parameters: [ 'data' ]
            };

            massert.throws(function () {
                Message.toRawString(message);
            });
        },

        spaceInCommandThrows: function () {
            var message = {
                command: 'FOO BAR',
                parameters: [ 'data' ]
            };

            massert.throws(function () {
                Message.toRawString(message);
            });
        },

        emptyNonLastParameterThrows: function () {
            var message = {
                command: 'COMMAND',
                parameters: [ 'data', 'mroe data', '', '=O' ]
            };

            massert.throws(function () {
                Message.toRawString(message);
            });
        },

        spaceInNonLastParameterThrows: function () {
            var message = {
                command: 'COMMAND',
                parameters: [ 'data', 'here is data', 'teehee' ]
            };

            massert.throws(function () {
                Message.toRawString(message);
            });
        }
    };
}());
