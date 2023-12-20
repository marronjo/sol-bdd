Feature: Foundry Counter Contract
  Let's see if this contract works

  Scenario: Incriment counter
    Given Counter contract is deployed, with alias "A"
    When the deployed Counter contract "A" is incrimented
    Then the stored value should be equal to 1 in contract "A"

  Scenario: Set counter
    Given Counter contract is deployed, with alias "B"
    When the deployed Counter contract "B" is set to 10
    Then the stored value should be equal to 10 in contract "B"
