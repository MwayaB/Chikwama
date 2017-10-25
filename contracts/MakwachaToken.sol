pragma solidity ^0.4.13;

contract Chikwama{
    
     struct Account 
     {
        address add;
        uint value;
        bytes32 id;
        uint8 chikwamaType; //0 central office 1 Agent 2 EndUser
        bytes32 pin;
    }
    
    uint256 public accountCount;
    mapping(bytes32 => address) accounts;
    mapping(address => mapping(bytes32 => Account)) chikwama;
    
    event CreateAccount(bytes32 NationalID, address ChikwamaAddress);
    
    function createChikwama(address _add, uint256 _value, uint256 _id, uint8 _chikwamaType, uint256 _pin) public returns(bool)
    {
        if (accounts[keccak256(_id)]==0x0)
        {
            accounts[keccak256(_id)] = _add;
            chikwama[_add][keccak256(_id)].add = _add;
            chikwama[_add][keccak256(_id)].id = keccak256(_id);
            chikwama[_add][keccak256(_id)].value = _value;
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



contract MakwachaToken {
    
     /* Public variables of the token */
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    address public centralOffice;
    uint256 public chikwamaFee;
    
    
  
    
    
    /* This creates an array with all balances */
    mapping (address => uint256) public balanceOf;
    
    mapping (address => mapping (address => uint256)) public allowance;
    
  
    
    /* This generates a public event on the blockchain that will notify clients of new Makwacha being issued*/
    event Issue(uint256 from, uint256 to, uint256 value);
    
     /* This generates a public event on the blockchain that will notify clients */
    event Transfer(uint256 from, uint256 to, uint256 value);
    
     /* This notifies clients about the amount burnt */
    event Burn(uint256 from, uint256 value);
    
    /* Initializes contract with initial supply tokens to the creator of the contract */
    function MakwachaToken(address _chikwamaContract) public {
        uint256 initialSupply = 0;
        centralOffice= msg.sender;
        Chikwama chikwama = Chikwama(_chikwamaContract);
        chikwama.createChikwama(centralOffice,initialSupply,207027734,0,1234);
        balanceOf[centralOffice] = initialSupply;              // Give the creator all initial tokens
        totalSupply = initialSupply;                        // Update total supply
        name = "Makwacha";                                   // Set the name for display purposes
        symbol = "MK";                               // Set the symbol for display purposes
        decimals = 2;                            // Amount of decimals for display purposes
    }
    
    
    function issue(address _to, uint256 _fromId, uint256 _toId, uint _value, uint256 _transactionFee) public returns (bool success)
    {
        require (_value < allowance[centralOffice][msg.sender]);     // Check allowance
        allowance[centralOffice][msg.sender] -= _value;
        chikwamaFee = _transactionFee * 120/100;  //sets chikwamafee by putting a 20% markup on transaction fee at current exchange rate
        
        _issue(_to,_fromId, _toId, _value);
        return true;
    }
    
    
     /* mint new makwacha, only can be called by this contract */
    function _issue(address _to, uint256 _fromId, uint256 _toId, uint _value) internal{
        
            require (_to != 0x0);                               // Prevent transfer to 0x0 address. Use burn() instead
            balanceOf[centralOffice] += _value;                         //Create tokens
            totalSupply += _value;                              //Update total supply
            require (balanceOf[_to] + _value > balanceOf[_to]); // Check for overflows
            var agentFee = chikwamaFee * 20/100;
            balanceOf[centralOffice] -= (_value-(chikwamaFee-agentFee));                         // Subtract from the sender
            balanceOf[_to] += (_value-chikwamaFee);                            // Add the same to the recipient
            balanceOf[msg.sender]+= agentFee;
            Issue(_fromId, _toId, _value);
        }
    
      /// @notice Send `_value` tokens to `_to` in behalf of `_from`
    /// @param _from The address of the sender
    /// @param _to The address of the recipient
    /// @param _value the amount to send
    function transferFrom(address _from, uint256 _fromId, address _to, uint256 _toId, uint _value, uint256 _transactionFee) public returns (bool success) {
        require (_value < allowance[_from][msg.sender]);     // Check allowance
        allowance[_from][msg.sender] -= _value;
        chikwamaFee = _transactionFee * 120/100;  //sets chikwamafee by putting a 20% markup on transaction fee at current exchange rate
        _transfer(_from, _fromId, _to,_toId, _value);
        return true;
    }

    /// @notice Allows `_spender` to spend no more than `_value` tokens in your behalf
    /// @param _spender The address authorized to spend
    /// @param _value the max amount they can spend
    function approve(address _spender, uint256 _value)public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        return true;
    }
    
     /* Internal transfer, only can be called by this contract */
    function _transfer(address _from, uint256 _fromId, address _to, uint256 _toId, uint _value)internal{
        require (_to != 0x0);                                                                       // Prevent transfer to 0x0 address. Use burn() instead
        
        require (balanceOf[_from] > _value + chikwamaFee);                                                   // Check if the sender has enough
        require (balanceOf[_to] + _value > balanceOf[_to]);                               // Check for overflows
        balanceOf[_from] -= (_value-chikwamaFee);                                                            // Subtract from the sender
        balanceOf[_to] += (_value-chikwamaFee);                                                              // Add the same to the recipient
        var agentFee = chikwamaFee * 20/100;
        balanceOf[centralOffice]+=(chikwamaFee- agentFee);
        balanceOf[msg.sender]+= agentFee;
        Transfer(_fromId, _toId, _value);
    }
    
    
  function burnFrom(address _from, uint256 _fromId, uint256 _value, uint256 _transactionFee) public returns (bool success) {
        chikwamaFee = _transactionFee * 120/100;
        require(balanceOf[_from] >= _value+ chikwamaFee);                // Check if the targeted balance is enough
        require(_value + chikwamaFee <= allowance[_from][msg.sender]);    // Check allowance
        balanceOf[_from] -= (_value+chikwamaFee);                         // Subtract from the targeted balance
        allowance[_from][msg.sender] -= _value+chikwamaFee;             // Subtract from the sender's allowance
        totalSupply -= (_value- chikwamaFee);                              // Update totalSupply
        var agentFee = chikwamaFee * 20/100;
        balanceOf[centralOffice]+=(chikwamaFee-agentFee);
        balanceOf[msg.sender]+=agentFee;
        Burn(_fromId, _value);
        return true;
    }
    
    function getChikwamaFee(uint256 _transactionFee) public returns(uint256)
    {
        chikwamaFee = _transactionFee*120/100;
        return chikwamaFee;
    }
    
  
}