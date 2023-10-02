const { compilerOptions } = require("./tsconfig");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  // this enables us to use tsconfig-paths with jest
  modulePaths: [compilerOptions.baseUrl],
};
