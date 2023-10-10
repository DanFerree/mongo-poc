/* eslint-env node */
module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    ignorePatterns: ["**/dist/**"],
    // overrides: [
    //     {
    //         files: ['**/dist/**'],
    //         extends: ['plugin:@typescript-eslint/disable-type-checked'],
    //     },
    // ],
};
