//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract BuyMeACoffee {
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    //Memo struct
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }
    // List of all memos received from friends
    Memo[] memos;

    // Address of conctract deployer
    address payable owner;
    address payable withdrawalUser;

    constructor() {
        owner = payable(msg.sender);
        withdrawalUser = payable(msg.sender);
    }

    //memory significa che non manteniamo nulla
    /**
        @dev buye a coffee for contract owner
        @param _name name of the coffee buyer
        @param _message a nice message from the coffee buyer
     */
    function buyCoffee(string memory _name, string memory _message)
        public
        payable
    {
        require(msg.value > 0, "can't buy coffee with 0 eth");
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    function buyLargeCoffee(string memory _name, string memory _message)
        public
        payable
    {
        require(
            msg.value >= 3 * 10**15,
            "can't buy a large coffee with less than 0.003 eth"
        );
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    /**
        @dev send all the money to the contract owner
     */
    function withdrawTips() public {
        require(withdrawalUser.send(address(this).balance));
    }

    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    function setWithdrawalAddress(address _newAddress) public {
        require(
            msg.sender == owner,
            "Only the owner can change receiver address"
        );
        withdrawalUser = payable(_newAddress);
    }
}
