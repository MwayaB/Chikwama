/*
file:   Base.sol

An basic contract furnishing inheriting contracts with ownership


*/

pragma solidity ^0.4.13;

import "./Account.sol";

contract Base
{


/* State Variables */

 uint public centralOffice;
 Account account;

/* Events */

/*public event when central office changes*/
event ChangedCentralOffice(address newCentralOffice);

event CentralOfficeCreated(string msg);
/* Modifiers */

       // To throw call not made by centralOffice
    modifier onlyCentralOffice() {
        require (msg.sender == account.getAddress(centralOffice));
        _;
    }
    
/* Functions */

    function Base(address _accountContract) { 
        centralOffice = 11223344; 
        account =  Account(_accountContract);
        account.createAccount(msg.sender,11223344,0,1234);
        CentralOfficeCreated("Central Office created");
    }

    function contractBalance() public constant returns(uint) {
        return this.balance;
    }

    // Change the owner of a central office
    function changeCentralOffice(address _newCentralOffice,uint _pin)
        public onlyCentralOffice returns (bool)
    {
        
        account.changeAddress(11223344,_newCentralOffice, _pin);
        ChangedCentralOffice(_newCentralOffice);
        return true;
    }
    
 
}

/* End of Base */