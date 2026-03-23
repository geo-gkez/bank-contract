// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

contract Bank {
    mapping(address => uint256) private accountBalances;

    function depositFunds() public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero.");
        accountBalances[msg.sender] += msg.value;
    }

    function withdrawFunds(uint256 amount) public {
        require(amount > 0, "Withdrawal amount must be greater than zero.");
        require(
            accountBalances[msg.sender] >= amount,
            "Withdrawal amount must be less or equal than balance"
        );

        accountBalances[msg.sender] -= amount;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
    }

    function transferFunds(address to, uint256 amount) public {
        require(to != address(0), "Cannot transfer to zero address");
        require(amount > 0, "Transfer amount must be greater than zero.");
        require(to != msg.sender, "We need 2 different wallets");
        require(accountBalances[msg.sender] >= amount, "Insufficient balance");
        accountBalances[msg.sender] -= amount;
        accountBalances[to] += amount;
    }
}
