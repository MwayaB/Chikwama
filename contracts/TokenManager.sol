/*
file:   TokenManager.sol

A basic contract for Managing fiat pegged tokens


*/

pragma solidity ^0.4.13;

import "./Account.sol";

contract TokenManager
{


/* State Variables */

 uint public centralOffice;
 Account account;

/* Events */

/*public event when central office changes*/
event ChangedCentralOffice(bytes32 newCentralOffice);

event CentralOfficeCreated(string created);
/* Modifiers */
  modifier onlyCentralOffice() {
        require (msg.sender == account.getAddresses(centralOffice,0));
        _;
    }
     
    
/* Functions */

    function TokenManager(address _accountContract)public { 
        centralOffice = 11223344; 
        account =  Account(_accountContract);
        account.createAccount(11223344,0,1234);
        account.addAddress(11223344,msg.sender);
        CentralOfficeCreated("Central Office created");
    }

    function contractBalance() public constant returns(uint) {
        return this.balance;
    }

    // Change the owner of a central office
    function changeCentralOffice(bytes32 _newCentralOffice,uint _pin)
        public onlyCentralOffice returns (bool)
    {
        
        account.changeCentralOffice(centralOffice,_newCentralOffice, _pin);
        ChangedCentralOffice(_newCentralOffice);
        return true;
    }
    
   
    
 
}

/* End of Base */