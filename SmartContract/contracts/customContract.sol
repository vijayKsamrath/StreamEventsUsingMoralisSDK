// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract customContract {
    struct Contact {
        string name;
        string email;
        string phoneNumber;
    }

    Contact[] private contacts; // Array to store multiple contacts
    event ContactAdded(address indexed user, string name, string phoneNumber, string email);


    // Function to add a new contact
    function addContact(string memory name, string memory email, string memory phoneNumber) public {
        require(bytes(name).length > 0, "Name must not be empty");
        require(bytes(email).length > 0, "Email must not be empty");
        require(bytes(phoneNumber).length > 0, "Phone number must not be empty");

        contacts.push(Contact(name, email, phoneNumber));
        emit ContactAdded(msg.sender, name, phoneNumber, email);

    }

    // Function to retrieve the number of stored contacts
    function getNumberOfContacts() public view returns (uint256) {
        return contacts.length;
    }

    // Function to retrieve contact details by index
    function getContactDetails(uint256 index) public view returns (string memory, string memory, string memory) {
        require(index < contacts.length, "Invalid index");
        Contact memory contact = contacts[index];
        return (contact.name, contact.email, contact.phoneNumber);
    }
}