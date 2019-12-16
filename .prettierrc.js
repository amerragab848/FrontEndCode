// Prettier configuration
// https://prettier.io/docs/en/configuration.html
module.exports = {
    printWidth: 80,
    singleQuote: true,
    trailingComma: "all",
    jsxBracketSameLine: true,
    tabWidth: 4,
    useTabs: false,
    parser: "babylon",
    endOfLine: "lf",
    overrides: [
        {
            files: "*.json",
            options: {
                parser: "json"
            }
        },
        {
            files: "*.css",
            options: {
                parser: "css"
            }
        },
        {
            files: "*.html",
            options: {
                parser: "html"
            }
        },
        {
            files: ".babelrc",
            options: {
                parser: "json"
            }
        }
    ]
};
