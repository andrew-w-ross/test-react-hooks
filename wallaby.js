module.exports = function(wallaby) {
  return {
    files: ["src/**/*.{ts,tsx}", "!src/**/*.test.{tsx,ts}"],
    tests: ["src/**/*.test.{tsx,ts}"],
    env: {
      type: "node",
      runner: "node"
    },
    compilers: {
      "**/*.{js,ts,tsx}": wallaby.compilers.babel()
    },
    testFramework: "jest",
    setup: function(wallaby) {
      var jestConfig = require("./package.json").jest;
      wallaby.testFramework.configure(jestConfig);
    }
  };
};
