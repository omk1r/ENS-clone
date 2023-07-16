//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract ENS{
using SafeMath for uint256;

    struct Domain{
        address owner;
        uint256 expiryDate;
        bool isRegistered;
    }

    mapping(string => Domain) public domains;
    event domainRegistered(string domain,address owner);
    event DomainTransferred(string domain,address oldOwner,address newOwner);

    uint256 public registrationCost = 100000000000000000;

    function registerDomain(string memory domain) external payable {
        require(!domains[domain].isRegistered || domains[domain].expiryDate < block.timestamp,"Domain already assigned to a address");
        require(msg.value == registrationCost,"Please send 1 ether to purchase the Name");
        domains[domain].owner = msg.sender;
        domains[domain].isRegistered = true;
        domains[domain].expiryDate = block.timestamp.add(3 * 365 days);

        emit domainRegistered(domain,msg.sender);
    }

    function transferDomain(string memory domain, address newOwner) external {
        require(domains[domain].owner == msg.sender, "You are not the owner of this domain");
        require(newOwner != address(0), "Invalid new owner address");

        domains[domain].owner = newOwner;

        emit DomainTransferred(domain, msg.sender, newOwner);
    }

    function getDomain(string memory domain) public view returns(address) {
        return domains[domain].owner;
    }
}