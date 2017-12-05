/*
file:   ERC20.sol


An ERC20 compliant token 

*/

pragma solidity ^0.4.13;


import "./Base.sol";
import "./Account.sol";

contract ERC20 
{

/* Events */

/* Structs */

/* Constants */

/* State Valiables */
string public name;
string public symbol;
uint8 public decimals;
uint256 public totalSupply;
uint256 public sizeOf;
Account account;
Base base;


    



 /* This creates an array with all balances */
    mapping (address => uint256) public balanceOf;
    
    mapping (address => mapping (address => uint256)) public allowance;

/* This generates a public event on the blockchain that will notify clients */
    event Transfer(address from, address to, uint256 value);
    
/* This notifies clients about the amount burnt */  
    event Burn(address from, uint256 value);
    
  
/* This generates a public event on the blockchain that will notify clients of new Makwacha being issued*/
    event Issue(address from, address to, uint256 value);
    
     event ApprovedToIssue(address,address,uint);
     
/* Funtions Public */

    function ERC20(string tokenName, string tokenSymbol)public
    {
        uint256 initialSupply = 0;      
        totalSupply = initialSupply;                        // Update total supply
        name = tokenName;                                   // Set the name for display purposes
        symbol = tokenSymbol;                               // Set the symbol for display purposes
        decimals = 0;
    }
    
    function balanceOf(address _add) returns(uint)
    {
        return balanceOf[_add];
    }
    
    
    function etherBalanceOf(address _addr) public constant returns (uint) {
        return _addr.balance;
    }

    function() public payable {
    }
    
    function issue(uint256 _fromId, uint256 _toId, uint _value)       external
        returns (bool)
    {
        require (_value < allowance[base.getCentralOffice()][msg.sender]);     // Check allowance
        allowance[base.getCentralOffice()][msg.sender] -= _value;
        _issue(account.getAddress(_toId),account.getAddress(_fromId), _value);
        return true;
    }
    
    
     /* mint new makwacha, only can be called by this contract */
    function _issue(address _to, address _from, uint _value) internal{
        
            require (_to != 0x0);                               // Prevent transfer to 0x0 address. Use burn() instead
            totalSupply += _value;                              //Update total supply
            require (balanceOf[_to] + _value > balanceOf[_to]); // Check for overflows             // Subtract from the sender
            balanceOf[_to] += (_value);                            // Add the same to the recipient
            Issue(_from, _to, _value);
        }
    
   
    

    
      /// @notice Send `_value` tokens to `_to` in behalf of `_from`
    /// @param _from The address of the sender
    /// @param _to The address of the recipient
    /// @param _value the amount to send
    function transferFrom(address _from,uint256 _fromId, address _to, uint256 _toId, uint _value) external
        returns (bool) {
        address from = account.getAddress(_fromId);
        address to = account.getAddress(_toId);
        require (_value < allowance[from][msg.sender]);     // Check allowance
        allowance[from][msg.sender] -= _value;
        _transfer(from,to, _value);
        return true;
    }
    
    function transfer(address _to, uint256 _value)public{
        _transfer(msg.sender,_to,_value);
    }


    
      /// @notice Allows `_spender` to spend no more than `_value` tokens in your behalf
    /// @param _spender The address authorized to spend
    /// @param _value the max amount they can spend
    function approve(address _spender, uint256 _value) external
        returns (bool success) {
        
        allowance[msg.sender][_spender] = _value;
        return true;
    }
    
     /* Internal transfer, only can be called by this contract */
    function _transfer(address _from, address _to, uint _value)internal{
        require (_to != 0x0);                                                                       // Prevent transfer to 0x0 address. Use burn() instead
        require (balanceOf[_from] > _value);                                                   // Check if the sender has enough
        require (balanceOf[_to] + _value > balanceOf[_to]);                               // Check for overflows
        balanceOf[_from] -= (_value);                                                            // Subtract from the sender
        balanceOf[_to] += (_value);                                                              // Add the same to the recipient
        Transfer(_from, _to, _value);
    }
        
    
    
    function burnFrom(uint256 _fromId, uint256 _value) public returns (bool success) {
        require(balanceOf[account.getAddress(_fromId)] >= _value);                // Check if the targeted balance is enough
        require(_value<= allowance[account.getAddress(_fromId)][msg.sender]);    // Check allowance
        balanceOf[account.getAddress(_fromId)] -= _value;                         // Subtract from the targeted balance
        allowance[account.getAddress(_fromId)][msg.sender] -= _value;             // Subtract from the sender's allowance
        totalSupply -= _value;                              // Update totalSupply
        Burn(account.getAddress(_fromId), _value);
        return true;
    }
    
    
}