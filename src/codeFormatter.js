const prettier = require("prettier");
const codeFormatter = code =>
  prettier.format(code, {
    semi: true,
    printWidth: 100,
    singleQuote: true,
    parser: "babel"
  });
module.exports = codeFormatter;
