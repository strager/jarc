(function () {
    var fs = require('fs');

    require.paths.unshift(__dirname);
    require.paths.unshift(__dirname + '/src');

    function joinPaths(/* paths... */) {
        return Array.prototype.join.call(arguments, '/');
    }

    function getFilesSync(root) {
        var filesAndDirs = fs.readdirSync(root);
        var files = [ ];
        var i, current;

        for (i = 0; i < filesAndDirs.length; ++i) {
            current = joinPaths(root, filesAndDirs[i]);

            if (fs.statSync(current).isDirectory()) {
                files = files.concat(getFilesSync(current));
            } else {
                files.push(current);
            }
        }

        return files;
    }

    var tests = { };

    var testFiles = getFilesSync(joinPaths(__dirname, 'test')).filter(function (filename) {
        return /\.js$/.test(filename);
    }).forEach(function (testFile) {
        var testName = testFile.match(/([^\/]+)\.js$/)[1];

        tests[testName] = require(testFile);
    });

    // patr is _RETARDED_ and requires every key in the _ENTIRE OBJECT GRAPH_
    // to begin with 'test'.  Who the hell does that?
    function fuckUpTestNames(object) {
        var output = { };
        var key, value;

        for (key in object) {
            if (!Object.prototype.hasOwnProperty.call(object, key)) {
                continue;
            }

            value = object[key];

            if (typeof value === 'object' && value !== null) {
                value = fuckUpTestNames(value);
            }

            key = 'test ' + key;

            output[key] = value;
        }

        return output;
    }

    if (require.main === module) {
        require('patr/runner').run(fuckUpTestNames(tests));
    }
}());
