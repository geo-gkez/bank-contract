// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

contract Bank {
    mapping(address => uint256) private accountBalances;

    function depositFunds() public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero.");
        accountBalances[msg.sender] += msg.value;
    }
}
