pragma solidity ^0.4.4;

contract Account{

      struct Account 
     {
        address add;
        bytes32 id;
        uint8 chikwamaType; //0 central office 1 Agent 2 EndUser
        bytes32 pin;
    }
    
    uint256 public accountCount;
    mapping(bytes32 => address) accounts;
    mapping(address => mapping(bytes32 => Account)) chikwama;
    
    event CreateAccount(bytes32 NationalID, address ChikwamaAddress);
    
    function createChikwama(address _add, uint256 _id, uint8 _chikwamaType, uint256 _pin) public returns(bool)
    {
        if (accounts[keccak256(_id)]==0x0)
        {
            accounts[keccak256(_id)] = _add;
            chikwama[_add][keccak256(_id)].add = _add;
            chikwama[_add][keccak256(_id)].id = keccak256(_id);
            chikwama[_add][keccak256(_id)].chikwamaType = _chikwamaType;
            chikwama[_add][keccak256(_id)].pin = keccak256(_pin);
            accountCount++;
            CreateAccount(keccak256(_id),_add);
            return true;
        }

    }
    
    function getChikwama(uint256 _id) public constant returns(address) {
        address _add = accounts[keccak256(_id)];
      
        return chikwama[_add][keccak256(_id)].add;
    
    }
    
    function checkPin(uint256 _id, uint256 _pin) public constant returns(bool){
        address _add = accounts[keccak256(_id)];
        if(chikwama[_add][keccak256(_id)].pin==keccak256(_pin))return true;
    }
    
    function changePin(uint256 _id, uint256 _pin, uint256 _newPin) public returns(bool)
    {
        address _add = accounts[keccak256(_id)];
        if(chikwama[_add][keccak256(_id)].pin == keccak256(_pin))
        {
            chikwama[_add][keccak256(_id)].pin = keccak256(_newPin);
            return true;
        }
        else return false;
    }
}
