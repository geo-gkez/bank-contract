// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

contract Bank {
    event Deposit(address indexed account, uint256 amount);
    event Withdrawal(address indexed account, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 amount);

    mapping(address => uint256) private accountBalances;
    mapping(address => uint256[]) private transactionHistory;

    function getBalance() external view returns (uint256) {
        return accountBalances[msg.sender];
    }

    function getTransactionHistory() external view returns (uint256[] memory) {
        return transactionHistory[msg.sender];
    }

    function depositFunds() public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero.");
        accountBalances[msg.sender] += msg.value;
        transactionHistory[msg.sender].push(block.number);
        emit Deposit(msg.sender, msg.value);
    }

    function withdrawFunds(uint256 amount) public {
        require(amount > 0, "Withdrawal amount must be greater than zero.");
        require(
            accountBalances[msg.sender] >= amount,
            "Withdrawal amount must be less or equal than balance"
        );

        accountBalances[msg.sender] -= amount;

        transactionHistory[msg.sender].push(block.number);
        emit Withdrawal(msg.sender, amount);

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

        transactionHistory[msg.sender].push(block.number);
        transactionHistory[to].push(block.number);
        emit Transfer(msg.sender, to, amount);
    }
}
