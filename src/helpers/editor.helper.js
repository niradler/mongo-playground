const prettier = require("prettier");

const codeFormatter = code =>
  prettier.format(code, {
    parser: "babel",
    semi: true,
    printWidth: 100,
    singleQuote: false
  });

export default { codeFormatter };
