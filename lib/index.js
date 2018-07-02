'use-strict';

function test(param) {
  console.log(`call function test with: ${param}`);
}

function anotherTest(param) {
  console.log(`call function anotherTest with: ${param}`);
}

module.exports = {
  test,
  anotherTest,
};
