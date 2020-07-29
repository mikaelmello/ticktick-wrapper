module.exports = {
    "extends": "airbnb-base",
    "rules": {
        "import/no-extraneous-dependencies": ["error", { "devDependencies": true }],
        "no-underscore-dangle": 0,
        "class-methods-use-this": 0,
    },
};