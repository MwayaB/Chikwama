pragma solidity ^0.4.13;

import "./Base.sol";

contract Account{
         
     struct AccountStructure 
     {
        address add;
        bytes32 id;
        uint8 accountType; //Account type 0 central office 1 Agent 2 EndUser
        bytes32 pin;
    }
    
    Base base;
    
    uint256 public accountCount;
    mapping(bytes32 => address) accounts;
    mapping(address => mapping(bytes32 => AccountStructure)) account;
    
    event CreateAccount(bytes32 NationalID, address accountAddress);

    
    function createAccount(address _add, uint256 _id, uint8 _type, uint256 _pin) public returns(bool)
    {
        if (accounts[keccak256(_id)]==0x0)
        {
            accounts[keccak256(_id)] = _add;
            account[_add][keccak256(_id)].add = _add;
            account[_add][keccak256(_id)].id = keccak256(_id);
            account[_add][keccak256(_id)].accountType = _type;
            account[_add][keccak256(_id)].pin = keccak256(_pin);
            accountCount++;
            CreateAccount(keccak256(_id),_add);
            return true;
        }
        
        else return false;

    }
    
    function deleteAccount(uint256 _id) internal returns(bool)
    {
        address _add = accounts[keccak256(_id)];
        delete account[_add][keccak256(_id)];
        delete accounts[keccak256(_id)];
        return true;
    }
    
    function getAddress(uint256 _id) public constant returns(address) {
        address _add = accounts[keccak256(_id)];
      
        return account[_add][keccak256(_id)].add;
    
    }
    
    function getType(uint256 _id) internal constant returns(uint){
        address _add = accounts[keccak256(_id)];
        
        return account[_add][keccak256(_id)].accountType;
    }
    
    
    function checkPin(uint256 _id, uint256 _pin) public constant returns(bool,uint){
        if(_checkPin(_id,_pin)){
        
            return(true, getType(_id));
        }
    }
    
    function _checkPin(uint256 _id, uint256 _pin) internal constant returns(bool){
        address _add = accounts[keccak256(_id)];
        if(account[_add][keccak256(_id)].pin==keccak256(_pin))return true;
    }
    
    function changePin(uint256 _id, uint256 _pin, uint256 _newPin) public returns(bool)
    {
        address _add = accounts[keccak256(_id)];
        if(account[_add][keccak256(_id)].pin == keccak256(_pin))
        {
            account[_add][keccak256(_id)].pin = keccak256(_newPin);
            return true;
        }
        else return false;
    }
    
    function changeCentralOffice(uint256 _id, address _new, uint256 _pin) external returns(bool)
    {
        if(_checkPin(_id,_pin)== true)
        {
          uint8 accountType = account[getAddress(_id)][keccak256(_id)].accountType;
          deleteAccount(_id);
          createAccount(_new,_id,accountType,1234);
          return true;
        }
        
        return false;
        
    }
}
