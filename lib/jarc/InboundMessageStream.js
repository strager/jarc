exports.$ = (function () {
    var EventEmitter = require('events').EventEmitter;
    var Message = require('jarc/Message');

    var InboundMessageStream = function () {
        this.buffer = '';
        this.readable = false;
        this.writeable = true;
    };

    InboundMessageStream.prototype = new EventEmitter();

    InboundMessageStream.prototype.write = function (data) {
        this.buffer += data;

        var parts = this.buffer.split(Message.separatorRegExp);

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

    return InboundMessageStream;
}());
