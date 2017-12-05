pragma solidity ^0.4.13;

contract Account{
         
     struct AccountStructure 
     {
        address add;
        bytes32 id;
        uint8 accountType; //Account type 0 central office 1 Agent 2 EndUser
        bytes32 pin;
    }
    
    
    uint256 public accountCount;
    mapping(bytes32 => address) accounts;
    mapping(address => mapping(bytes32 => AccountStructure)) chikwama;
    
    event CreateAccount(bytes32 NationalID, address ChikwamaAddress);
    
    function createAccount(address _add, uint256 _id, uint8 _type, uint256 _pin) public returns(bool)
    {
        if (accounts[keccak256(_id)]==0x0)
        {
            accounts[keccak256(_id)] = _add;
            chikwama[_add][keccak256(_id)].add = _add;
            chikwama[_add][keccak256(_id)].id = keccak256(_id);
            chikwama[_add][keccak256(_id)].accountType = _type;
            chikwama[_add][keccak256(_id)].pin = keccak256(_pin);
            accountCount++;
            CreateAccount(keccak256(_id),_add);
            return true;
        }
        
        else return false;

    }
    
    function getAddress(uint256 _id) public constant returns(address) {
        address _add = accounts[keccak256(_id)];
      
        return chikwama[_add][keccak256(_id)].add;
    
    }
    
    function getType(uint256 _id) internal constant returns(uint){
        address _add = accounts[keccak256(_id)];
        
        return chikwama[_add][keccak256(_id)].accountType;
    }
    
    
    function checkPin(uint256 _id, uint256 _pin) public constant returns(bool,uint){
        address _add = accounts[keccak256(_id)];
        if(chikwama[_add][keccak256(_id)].pin==keccak256(_pin))return (true,getType(_id));
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
