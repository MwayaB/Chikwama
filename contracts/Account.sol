pragma solidity ^0.4.13;


contract Account{
         
     struct AccountStructure 
     {
        string seed;
        address [100] addresses;
        bytes32 id;
        uint8 accountType; //Account type 0 central office 1 Agent 2 EndUser
        bytes32 pin;
        uint addcount;

    }
    

    
    uint256 public accountCount;
    mapping(bytes32 => AccountStructure) account;
    
    event CreateAccount(uint nationalId);

    
    function createAccount(uint256 _id, uint8 _type, uint256 _pin) public returns(bool)
    {
        if(account[keccak256(_id)].addcount==0)
        {
            account[keccak256(_id)].id = keccak256(_id);
            account[keccak256(_id)].accountType = _type;
            account[keccak256(_id)].pin = keccak256(_pin);

            accountCount++;
            CreateAccount(_id);
            return true;
        }
        
        return false;
    
    }
    
    function addSeed(uint256 _id,string _seed) public returns(bool)
    {
        account[keccak256(_id)].seed=_seed;
        return true;
    }
    
    function addAddress(uint256 _id,address _add) public returns(bool)
    {
        account[keccak256(_id)].addresses[account[keccak256(_id)].addcount] = _add;
        account[keccak256(_id)].addcount++;
        return true;
    }
    
    function getAddCount(uint256 _id) public constant returns(uint)
    {
        return account[keccak256(_id)].addcount;
    }
    
    function deleteAccount(uint256 _id) internal returns(bool)
    {
        delete account[keccak256(_id)];
        return true;
    }
    
    function getAddresses(uint256 _id, uint _index)public constant returns(address)
    {
        return account[keccak256(_id)].addresses[_index];
          
    }
    
    
    function getType(uint256 _id) internal constant returns(uint){
        
        return account[keccak256(_id)].accountType;
    }
    
    
    function checkPin(uint256 _id, uint256 _pin) public constant returns(bool,uint){
        if(_checkPin(_id,_pin)){
        
            return(true, getType(_id));
        }
    }
    
    function _checkPin(uint256 _id, uint256 _pin) internal constant returns(bool){
        if(account[keccak256(_id)].pin==keccak256(_pin))return true;
    }
    
    function changePin(uint256 _id, uint256 _pin, uint256 _newPin) public returns(bool)
    {
        if(account[keccak256(_id)].pin == keccak256(_pin))
        {
            account[keccak256(_id)].pin = keccak256(_newPin);
            return true;
        }
        else return false;
    }
    
    function changeCentralOffice(uint256 _id,uint _new, uint256 _pin) external returns(bool)
    {
        if(_checkPin(_id,_pin)== true)
        {
          uint8 accountType = account[keccak256(_id)].accountType;
          deleteAccount(_id);
          createAccount(_new,accountType,1234);
          return true;
        }
        
        return false;
        
    }
}
