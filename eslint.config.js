const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
    {
        ignores: ["src/vendor/**", "dist/**"]
    },
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2018,
            sourceType: "script",
            globals: {
                ...globals.browser,
                ...globals.jquery,
                ...globals.jasmine,
                AlbumModel: "writable",
                AlbumPhotos: "writable",
                AlbumHtmlDelegate: "writable",
                AlbumAjaxDelegate: "writable",
                Highlight: "writable",
                Resize: "writable",
                MouseTimer: "writable",
                Mustache: "readonly",
                watch: "readonly",
                unwatch: "readonly",
                linearPartition: "readonly",
                $container: "writable",
                $imgs: "writable",
                model: "writable",
                highlight: "writable",
                $view: "writable",
                $detailsView: "writable"
            }
        },
        rules: {
            "no-unused-vars": "off",
            "no-console": "off",
            "no-undef": "off",
            "no-redeclare": "off",
            "no-prototype-builtins": "off",
            "no-useless-escape": "off"
        }
    }
];
