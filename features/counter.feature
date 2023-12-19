Feature: counter contract
  Let's see if this contract works

  Scenario: Sunday isn't Friday
    Given Counter contract is deployed, with alias "A"
    When The counter on deployed Counter contract "A" is incrimented
    Then Then the stored value should be 1 in contract "A"