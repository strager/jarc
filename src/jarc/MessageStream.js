exports.$ = (function () {
    var EventEmitter = require('events').EventEmitter;
    var Message = require('jarc/Message');

    var messageSeparator = '\r\n';
    var messageSeparatorRe = /\r\n/gm;

    var MessageStream = function () {
        this.inbound = new InboundMessageStream();
        this.outbound = new OutboundMessageStream();
    };

    var InboundMessageStream = function () {
        this.buffer = '';
    };

    InboundMessageStream.prototype = new EventEmitter();

    InboundMessageStream.prototype.write = function (data) {
        this.buffer += data;

        var parts = this.buffer.split(messageSeparatorRe);

        if (parts.length <= 1) {
            return;
        }

        parts.slice(0, -1).forEach(function (part) {
            var message;
            
            try {
                message = Message.fromRawString(part);
            } catch (e) {
                this.emit('error', e);

                return;
            }

            this.emit('message', message);
        }, this);
    };

    var OutboundMessageStream = function () {
    };

    OutboundMessageStream.prototype = new EventEmitter();

    OutboundMessageStream.prototype.write = function (message) {
        var data;
        
        try {
            data = Message.toRawString(message) + messageSeparator;
        } catch (e) {
            this.emit('error', e);

            return;
        }

        this.emit('data', data);
    };

    return MessageStream;
}());
