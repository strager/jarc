exports.$ = (function () {
    var EventEmitter = require('events').EventEmitter;
    var Message = require('jarc/Message');

    var OutboundMessageStream = function () {
        this.readable = true;
        this.writeable = false;
    };

    OutboundMessageStream.prototype = new EventEmitter();

    OutboundMessageStream.prototype.write = function (message) {
        var data;
        
        try {
            data = Message.toRawString(message) + Message.separatorString;
        } catch (e) {
            this.emit('error', e);

            return;
        }

        this.emit('data', data);
    };

    return OutboundMessageStream;
}());
