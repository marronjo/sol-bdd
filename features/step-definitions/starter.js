const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

Given('today is {string}', function (day) {
  this.today = day;
});
  
When('I ask whether it\'s Friday yet', function () {
  this.actualAnswer = this.today == 'Friday' ? 'Yep' : 'Nope';
});

Then('I should be told {string}', function (expectedAnswer) {
  assert.strictEqual(this.actualAnswer, expectedAnswer);
});