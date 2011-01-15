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

    exports.toRawString = function (message) {
        function containsOnlyNonWhitespace(string) {
            return /^\S+$/.test(string);
        }

        var retParts = [ ];

        if (message.prefixString) {
            if (!containsOnlyNonWhitespace(message.prefixString)) {
                throw {
                    message: 'Prefix must not contain whitespace',
                    messageData: message,
                    prefix: message.prefixString
                };
            }

            retParts.push(':' + message.prefixString);
        }

        if (typeof message.command !== 'string' || !containsOnlyNonWhitespace(message.command)) {
            throw {
                message: 'Command must be non-empty and must not contain whitespace',
                messageData: message,
                command: message.command
            };
        }

        retParts.push(message.command);

        var parameters;

        if (message.parameters instanceof Array) {
            parameters = message.parameters.slice(0, -1);

            parameters.forEach(function (parameter, index) {
                if (!containsOnlyNonWhitespace(parameter)) {
                    throw {
                        message: 'Only the last parameter can contain whitespace',
                        messageData: message,
                        parameter: parameter,
                        parameterIndex: index
                    };
                }
            });

            retParts = retParts.concat(parameters);

            if (message.parameters.length > 0) {
                retParts.push(':' + message.parameters.slice(-1)[0]);
            }
        }

        return retParts.join(' ');
    };
}());
