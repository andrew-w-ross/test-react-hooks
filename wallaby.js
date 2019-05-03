module.exports = function(wallaby) {
  return {
    files: [
      "setup.js",
      "src/**/*.{ts,tsx,js,jsx}",
      "!src/**/*.test.{ts,tsx,js,jsx}"
    ],
    tests: ["src/**/*.test.{ts,tsx,js,jsx}"],
    env: {
      type: "node",
      runner: "node"
    },
    compilers: {
      "**/*.{ts,tsx,js,jsx}": wallaby.compilers.babel()
    },
    testFramework: "jest",
    setup: function(wallaby) {
      var jestConfig = require("./package.json").jest;
      wallaby.testFramework.configure(jestConfig);
    }
  };
};
