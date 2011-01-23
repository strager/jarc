(function () {
    var sys = require('sys');

    var JarcError = function (message, data) {
        if (!(this instanceof JarcError)) {
            return new JarcError(message, data);
        }

        this.message = message;
        this.data = data;
    };

    JarcError.__proto__ = Error;

    JarcError.prototype.toString = function () {
        return this.message + '; data = ' + sys.inspect(this.data);
    };

    exports.Error = JarcError;
}());
