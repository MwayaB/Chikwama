/*
file:   Base.sol

An basic contract furnishing inheriting contracts with ownership


*/

pragma solidity ^0.4.13;

contract Base
{


/* State Variables */

 address public centralOffice;

/* Events */

/*public event when central office changes*/
event ChangedCentralOffice(address indexed oldCentralOffice, address indexed newCentralOffice);

/* Modifiers */

       // To throw call not made by centralOffice
    modifier onlyCentralOffice() {
        require (msg.sender == centralOffice);
        _;
    }
    
/* Functions */

    function Base() { centralOffice = msg.sender; }

    function contractBalance() public constant returns(uint) {
        return this.balance;
    }

    // Change the owner of a central office
    function changeCentralOffice(address _newCentralOffice)
        public onlyCentralOffice returns (bool)
    {
        centralOffice = _newCentralOffice;
        ChangedCentralOffice(msg.sender, centralOffice);
        return true;
    }
    
 
}

/* End of Base */