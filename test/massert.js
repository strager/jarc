(function () {
    var assert = require('assert');

    exports.throws = function (/* [comment], callback */) {
        var comment, callback, exception;

        if (arguments.length >= 2) {
            comment = arguments[0];
            callback = arguments[1];
        } else {
            callback = arguments[0];
        }

        try {
            callback();
        } catch (e) {
            exception = e;
        }

        if (!exception) {
            assert.fail(comment || 'Exception expected; none thrown');
        }
    };
}());
