(function () {
    exports.fromRawString = function (rawString) {
        var lazyMessage = new RegExp(
            '^' +
            '(:(.*?)[ ]+)?' + // Optional prefix [2] [1?]
            '(.*?)' +         // Plain arguments [3]
            '([ ]:(.*?))?' +  // Last argument   [5] [4?]
            '$'
        );

        var match = rawString.match(lazyMessage);

        if (!match) {
            throw {
                message: 'Raw message string has an invalid format',
                rawString: rawString
            };
        }

        var args = match[3].split(/ +/g);
        
        if (match[4]) {
            args.push(match[5]);
        }

        if (args.length === 0) {
            throw {
                message: 'Raw message must contain at least one argument',
                rawString: rawString
            };
        }

        return {
            prefixString: match[1] ? match[2] : null,
            command: args[0],
            parameters: args.slice(1)
        };
    };

    exports.toRawString = function () {
        // Derp.
        return 'PING :data';
    };
}());
