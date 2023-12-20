
    (function(graph) {
      function start(module) {
        function require(relativePath) {
          return start(graph[module].dependencies[relativePath])
        }
        var exports = {};
        eval(graph[module].code);
        return exports;
      }
      start('./src/index.js')
    })({"./src/index.js":{"dependencies":{"./message.js":"./src/message.js"},"code":"\"use strict\";\n\nvar _message = _interopRequireDefault(require(\"./message.js\"));\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\nconsole.log(_message[\"default\"]);"},"./src/message.js":{"dependencies":{"./word.js":"./src/word.js","./hello.js":"./src/hello.js"},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\nvar _word = require(\"./word.js\");\nvar _hello = require(\"./hello.js\");\nvar _default = exports[\"default\"] = \"\".concat(_hello.hello, \" \").concat(_word.word);"},"./src/word.js":{"dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.word = void 0;\nvar word = exports.word = 'World';"},"./src/hello.js":{"dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.hello = void 0;\nvar hello = exports.hello = 'Hello';"}})
  