pragma solidity ^0.4.13;

contract Chikwama{
    
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


contract MakwachaToken {
    
    /* State Variables */
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    address public centralOffice;
    uint256 public sizeOf;
    Chikwama chikwama;
    
    struct Trade
    {
        address trader;
        bool side; //false =buy, true = sell
        uint256 price;
        uint256 tokens;
        
    }
   
    Trade public trade;
    /* This creates an array with all balances */
    mapping (address => uint256) public balanceOf;
    
    mapping (address => mapping (address => uint256)) public allowance;
    
    mapping(uint256 => Trade) public priceBook;

     // Mapping for ether ownership of accumulated deposits, sales and refunds.
    mapping (address => uint) etherBalance;


    
    
       
    
    /*public even when central office changes*/
    event ChangedCentralOffice(address indexed oldCentralOffice, address indexed newCentralOffice);
    
    /* This generates a public event on the blockchain that will notify clients of new Makwacha being issued*/
    event Issue(address from, address to, uint256 value);
    
     /* This generates a public event on the blockchain that will notify clients */
    event Transfer(address from, address to, uint256 value);
    
     /* This notifies clients about the amount burnt */
    event Burn(address from, uint256 value);
    
    event TradeResult(string);
    

    event ApprovedToIssue(address,address,uint);
    
    /* Modifiers */

    // To throw call not made by centralOffice
    modifier onlyCentralOffice() {
        require (msg.sender == centralOffice);
        _;
    }
    
    // This modifier can be used on functions with external calls to
    // prevent reentry attacks.
    // Constraints:
    //   Protected functions must have only one point of exit.
    //   Protected functions cannot use the `return` keyword
    //   Protected functions return values must be through return parameters.
   

    
   
    
    /* Functions */
    
      // Change the owner of a contract
    function changeCentralOffice(address _newCentralOffice)
        public onlyCentralOffice returns (bool)
    {
        centralOffice = _newCentralOffice;
        ChangedCentralOffice(msg.sender, centralOffice);
        return true;
    }
    
     function contractBalance() public constant returns(uint256) {
        return this.balance;
    }
    

    
     function balanceOf(address _addr)
        public
        constant
        returns (uint)
    {
        return balanceOf[_addr];
    }
    
   
    
    /* Initializes contract with initial supply tokens to the creator of the contract */
    function MakwachaToken(address _chikwamaContract) public {
        sizeOf = 0;
        uint256 initialSupply = 0;
        centralOffice= msg.sender;
        chikwama = Chikwama(_chikwamaContract);
        chikwama.createChikwama(centralOffice,207027734,0,1234);
        balanceOf[centralOffice] = initialSupply;              // Give the creator all initial tokens
        totalSupply = initialSupply;                        // Update total supply
        name = "Makwacha";                                   // Set the name for display purposes
        symbol = "MK";                               // Set the symbol for display purposes
        decimals = 0;                            // Amount of decimals for display purposes
    }
    


    function etherBalanceOf(address _addr) public constant returns (uint) {
        return _addr.balance;
    }






    
    
    
   function() public payable {
    } 
    
    function issue(uint256 _fromId, uint256 _toId, uint _value)       external
        returns (bool)
    {
        require (_value < allowance[centralOffice][msg.sender]);     // Check allowance
        allowance[centralOffice][msg.sender] -= _value;
        _issue(chikwama.getChikwama(_toId),chikwama.getChikwama(_fromId), _value);
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
    
    
    function buy(uint256 _price, uint256 _tokens) public returns(bool success)
    {
        trade.trader = msg.sender;
        trade.side = false;
        trade.price = _price;
        trade.tokens = _tokens;
        
        if(etherBalanceOf(trade.trader)<etherBalance[trade.trader]+(_price*_tokens)|| _tokens==0)
        return false;
        
        etherBalance[trade.trader] += (_price*_tokens);
        setTrade(trade);
    
        return true;
    }
    
    function sell(uint256 _price, uint256 _tokens) public returns(bool success)
    {
        trade.trader = msg.sender;
        trade.side = true;
        trade.price = _price;
        trade.tokens = _tokens;
        
        if(balanceOf[trade.trader]<_tokens || _tokens == 0)
        return false;
        
        setTrade(trade);
 
        return true;
    }
    
    
    function make(uint256 _tokens,uint256 _price, address _buyer, address _seller)internal returns (bool success)
    {
        
        _transfer(_seller, _buyer, _tokens);
        
        etherBalance[_buyer] -=_tokens*_price;
        _buyer.send(_tokens*_price);
        
    
    
    }
    
    function setTrade(Trade _trade) internal 
    {
        if(sizeOf ==0)
        {
            priceBook[sizeOf] = _trade;
            sizeOf++;
            TradeResult("trade added");
        }
        
        for(uint x = 0; x<=sizeOf; x++)
        {
           
            
                if(priceBook[x].trader==_trade.trader && priceBook[x].price == _trade.price && priceBook[x].side == _trade.side && priceBook[x].tokens == _trade.tokens)
                    {
                        TradeResult("trade already exists");
                        return;
                    }
                else if(priceBook[x].side==true && _trade.side==false && priceBook[x].price <= _trade.price)
                {
                        if(priceBook[x].tokens>_trade.tokens)
                        {
                             
                             make(_trade.tokens,priceBook[x].price,_trade.trader,priceBook[x].trader);
                             priceBook[x].tokens = (priceBook[x].tokens-_trade.tokens);
                             TradeResult("buy executed");
                             return;
                        }
                       else if(priceBook[x].tokens<_trade.tokens)
                       {
                           make(_trade.tokens,priceBook[x].price,_trade.trader,priceBook[x].trader);
                           _trade.tokens=(_trade.tokens-priceBook[x].tokens);
                           delete priceBook[x];
                           setTrade(_trade);
                       }
                       else if(_trade.tokens==priceBook[x].tokens)
                       {
                            make(_trade.tokens,priceBook[x].price,_trade.trader,priceBook[x].trader);
                           delete priceBook[x];
                           TradeResult("buy executed");
                           return;
                       }
                        else if(_trade.tokens==0)
                       {
                           TradeResult("buy executed");
                           return;
                       }
                        
                        
                }
                else if(priceBook[x].side==false && _trade.side==true && priceBook[x].price >= _trade.price)
                {
                        if(priceBook[x].tokens>_trade.tokens)
                        {
                             
                             make(_trade.tokens,priceBook[x].price,priceBook[x].trader,_trade.trader);
                             priceBook[x].tokens = (priceBook[x].tokens-_trade.tokens);
                             TradeResult("Sell executed");
                             return;
                        }
                       else if(priceBook[x].tokens<_trade.tokens)
                       {
                           make(_trade.tokens,priceBook[x].price,priceBook[x].trader,_trade.trader);
                           _trade.tokens=(_trade.tokens-priceBook[x].tokens);
                           delete priceBook[x];
                           setTrade(_trade);
                       }
                       else if(_trade.tokens==priceBook[x].tokens)
                       {
                            make(_trade.tokens,priceBook[x].price,priceBook[x].trader,_trade.trader);
                           delete priceBook[x];
                           TradeResult("Sell executed");
                           return;
                           
                       }
                        else if(_trade.tokens==0)
                       {
                           TradeResult("Sell executed");
                           return;
                       }
                    
                }
                
               
            }
           
           
     
            priceBook[x-1] = _trade;
            sizeOf++;
           TradeResult("trade added");
           return;
        
        
        
        
    }

      /// @notice Send `_value` tokens to `_to` in behalf of `_from`
    /// @param _from The address of the sender
    /// @param _to The address of the recipient
    /// @param _value the amount to send
    function transferFrom(address _from,uint256 _fromId, address _to, uint256 _toId, uint _value) external
        returns (bool) {
        address from = chikwama.getChikwama(_fromId);
        address to = chikwama.getChikwama(_toId);
        require (_value < allowance[from][msg.sender]);     // Check allowance
        allowance[from][msg.sender] -= _value;
        _transfer(from,to, _value);
        return true;
    }

    /// @notice Allows `_spender` to spend no more than `_value` tokens in your behalf
    /// @param _spender The address authorized to spend
    /// @param _value the max amount they can spend
    function approveIssuance(address _spender, uint256 _value)public onlyCentralOffice returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        ApprovedToIssue(msg.sender,_spender,_value);
        return true;
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
        require(balanceOf[chikwama.getChikwama(_fromId)] >= _value);                // Check if the targeted balance is enough
        require(_value<= allowance[chikwama.getChikwama(_fromId)][msg.sender]);    // Check allowance
        balanceOf[chikwama.getChikwama(_fromId)] -= _value;                         // Subtract from the targeted balance
        allowance[chikwama.getChikwama(_fromId)][msg.sender] -= _value;             // Subtract from the sender's allowance
        totalSupply -= _value;                              // Update totalSupply
        Burn(chikwama.getChikwama(_fromId), _value);
        return true;
    }
    

    
  
}