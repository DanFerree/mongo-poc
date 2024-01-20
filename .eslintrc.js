/* eslint-env node */
module.exports = {
    extends: ['eslint:recommended'],
    parserOptions: {
        ecmaVersion: "latest"
    },

    env: {
        es6: true,
        node: true,
        jest: true,
    },
    // parser: '@typescript-eslint/parser',
    // plugins: ['@typescript-eslint'],
    root: true,
    ignorePatterns: ["**/dist/**"],
    // overrides: [
    //     {
    //         files: ['**/dist/**'],
    //         extends: ['plugin:@typescript-eslint/disable-type-checked'],
    //     },
    // ],
};
