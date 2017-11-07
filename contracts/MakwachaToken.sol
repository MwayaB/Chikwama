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
    Chikwama chikwama;
    bool mutex;
    
    
   
    
    /* Constants */

    uint constant NULL = 0;
    uint constant HEAD = NULL;
    uint constant MINNUM = uint(1);
    // use only 128 bits of uint to prevent mul overflows.
    uint constant MAXNUM = 2**128;
    uint constant MINPRICE = uint(1);
    uint constant NEG = uint(-1); //2**256 - 1
    bool constant PREV = false;
    bool constant NEXT = true;
    bool constant BID = false;
    bool constant ASK = true;
    bool constant LT = false;
    bool constant GT = true;
    // No type bool <-> int type converstion in solidity :~(
    uint constant iTRUE = 1;
    uint constant iFALSE = 0;
    uint constant iPOS = 1;
    uint constant iZERO = 0;
    uint constant iNEG = uint(-1);
    
     struct CLL{
        mapping (uint => mapping (bool => uint)) cll;
    }
    
    
    
    // minimum gas required to prevent out of gas on 'take' loop
    uint constant MINGAS = 10000000000;
    
    
      // For staging and commiting trade details.  This saves unneccessary state
    // change gas usage during multi order takes but does increase logic
    // complexity when encountering 'trade with self' orders
    struct TradeMessage {
        bool make;
        bool side;
        uint price;
        uint tradeAmount;
        uint balance;
        uint etherBalance;
    }
    
    /* ITT Interface State Valiables */

    // To allow for trade halting by owner.
    bool public trading;

    // Mapping for ether ownership of accumulated deposits, sales and refunds.
    mapping (address => uint) etherBalance;

    // Orders are stored in circular linked list FIFO's which are mappings with
    // price as key and value as trader address.  A trader can have only one
    // order open at each price. Reordering at that price will cancel the first
    // order and push the new one onto the back of the queue.
    mapping (uint => CLL) orderFIFOs;
    
    // Order amounts are stored in a seperate lookup. The keys of this mapping
    // are `sha3` hashes of the price and trader address.
    // This mapping prevents more than one order at a particular price.
    mapping (bytes32 => uint) amounts;

    // The pricebook is a linked list holding keys to lookup the price FIFO's
    CLL priceBook = orderFIFOs[0];



/*Math Functions*/

    
    // @dev Parametric comparitor for > or <
    // !_sym returns a < b
    // _sym  returns a > b
    function cmp (uint a, uint b, bool _sym) internal constant returns (bool)
    {
        return (a!=b) && ((a < b) != _sym);
    }

    /// @dev Parametric comparitor for >= or <=
    /// !_sym returns a <= b
    /// _sym  returns a >= b
    function cmpEq (uint a, uint b, bool _sym) internal constant returns (bool)
    {
        return (a==b) || ((a < b) != _sym);
    }
    
    /// Trichotomous comparitor
    /// a < b returns -1
    /// a == b returns 0
    /// a > b returns 1
/*    function triCmp(uint a, uint b) internal constant returns (bool)
    {
        uint c = a - b;
        return c & c & (0 - 1);
    }
    
    function nSign(uint a) internal returns (uint)
    {
        return a & 2^255;
    }
    
    function neg(uint a) internal returns (uint) {
        return 0 - a;
    }
*/    
    function safeMul(uint a, uint b) internal constant returns (uint)
    {
      uint c = a * b;
      assert(a == 0 || c / a == b);
      return c;
    }

    function safeSub(uint a, uint b) internal constant returns (uint)
    {
      assert(b <= a);
      return a - b;
    }

    function safeAdd(uint a, uint b) internal constant returns (uint)
    {
      uint c = a + b;
      assert(c>=a && c>=b);
      return c;
    }
    
    
    /* This creates an array with all balances */
    mapping (address => uint256) public balanceOf;
    
    mapping (address => mapping (address => uint256)) public allowance;
    
        // Triggered on a make sell order
    event Ask (uint indexed price, uint amount, address indexed trader);

    // Triggered on a make buy order
    event Bid (uint indexed price, uint amount, address indexed trader);

    // Triggered on a filled order
    event Sale (uint indexed price, uint amount, address indexed buyer, address indexed seller, bool side);

    // Triggered when trading is started or halted
    event Trading(bool trading);
    
    /*public even when central office changes*/
    event ChangedCentralOffice(address indexed oldCentralOffice, address indexed newCentralOffice);
    
    /* This generates a public event on the blockchain that will notify clients of new Makwacha being issued*/
    event Issue(address from, address to, uint256 value);
    
     /* This generates a public event on the blockchain that will notify clients */
    event Transfer(address from, address to, uint256 value);
    
     /* This notifies clients about the amount burnt */
    event Burn(address from, uint256 value);
    


    
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
    modifier preventReentry() {
        require (!mutex);
        mutex = true;
        _;
        delete mutex;
        return;
    }

    // This modifier can be applied to pulic access state mutation functions
    // to protect against reentry if a `mutextProtect` function is already
    // on the call stack.
    modifier noReentry() {
        require (!mutex);
        _;
    }

    // Same as noReentry() but intended to be overloaded
    modifier canEnter() {
        require (!mutex);
        _;
    }
    
     modifier isAvailable(uint _amount) {
        require (_amount <= balanceOf[msg.sender]);
        _;
    }

    modifier isAllowed(address _from, uint _amount) {
        require (_amount <= allowance[_from][msg.sender] ||
           _amount <= balanceOf[_from]);
           _;
    }
    
    /// @dev Passes if token is currently trading
    modifier isTrading() {
        require (trading);
        _;
    }

    /// @dev Validate buy parameters
    modifier isValidBuy(uint _bidPrice, uint _amount) {
        require ((etherBalance[msg.sender] + msg.value) >= (_amount * _bidPrice) ||
            _amount != 0 || _amount <= totalSupply ||
            _bidPrice > MINPRICE || _bidPrice < MAXNUM); // has insufficient ether.
        _;
    }

    /// @dev Validates sell parameters. Price must be larger than 1.
    modifier isValidSell(uint _askPrice, uint _amount) {
        require (_amount <= balanceOf[msg.sender] || _amount != 0 ||
            _askPrice >= MINPRICE || _askPrice <= MAXNUM);
        _;
    }
    
    /// @dev Validates ether balance
    modifier hasEther(address _member, uint _ether) {
        require (etherBalance[_member] >= _ether);
        _;
    }

    /// @dev Validates token balance
    modifier hasBalance(address _member, uint _amount) {
        require (balanceOf[_member] >= _amount);
        _;
    }
    
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
    
    function safeSend(address _recipient, uint _ether)
        internal
        preventReentry()
        returns (bool success_)
    {
        require(_recipient.call.value(_ether)());
        success_ = true;
    }
    
     function balanceOf(address _addr)
        public
        constant
        returns (uint)
    {
        return balanceOf[_addr];
    }
    
    /*CLL functions*/
    
    // n: node id  d: direction  r: return node id

    // Return existential state of a list.
    function exists(CLL storage self)
        internal
        constant returns (bool)
    {
        if (self.cll[HEAD][PREV] != HEAD || self.cll[HEAD][NEXT] != HEAD)
            return true;
    }
    
    // Returns the number of elements in the list
    function sizeOf(CLL storage self) internal constant returns (uint r) {
        uint i = step(self, HEAD, NEXT);
        while (i != HEAD) {
            i = step(self, i, NEXT);
            r++;
        }
        return;
    }

    // Returns the links of a node as and array
    function getNode(CLL storage self, uint n)
        internal  constant returns (uint[2])
    {
        return [self.cll[n][PREV], self.cll[n][NEXT]];
    }

    // Returns the link of a node `n` in direction `d`.
    function step(CLL storage self, uint n, bool d)
        internal  constant returns (uint)
    {
        return self.cll[n][d];
    }

    // Can be used before `insert` to build an ordered list
    // `a` an existing node to search from, e.g. HEAD.
    // `b` value to seek
    // `r` first node beyond `b` in direction `d`
    function seek(CLL storage self, uint a, uint b, bool d)
        internal  constant returns (uint r)
    {
        r = step(self, a, d);
        while  ((b!=r) && ((b < r) != d)) r = self.cll[r][d];
        return;
    }

    // Creates a bidirectional link between two nodes on direction `d`
    function stitch(CLL storage self, uint a, uint b, bool d) internal  {
        self.cll[b][!d] = a;
        self.cll[a][d] = b;
    }

    // Insert node `b` beside existing node `a` in direction `d`.
    function insert (CLL storage self, uint a, uint b, bool d) internal  {
        uint c = self.cll[a][d];
        stitch (self, a, b, d);
        stitch (self, b, c, d);
    }
    
    function remove(CLL storage self, uint n) internal returns (uint) {
        if (n == NULL) return;
        stitch(self, self.cll[n][PREV], self.cll[n][NEXT], NEXT);
        delete self.cll[n][PREV];
        delete self.cll[n][NEXT];
        return n;
    }

    function push(CLL storage self, uint n, bool d) internal  {
        insert(self, HEAD, n, d);
    }
    
    function pop(CLL storage self, bool d) internal returns (uint) {
        return remove(self, step(self, HEAD, d));
    }
    
    
    /* Initializes contract with initial supply tokens to the creator of the contract */
    function MakwachaToken(address _chikwamaContract) public {
        // setup pricebook and maximum spread.
        priceBook.cll[HEAD][PREV] = MINPRICE;
        priceBook.cll[MINPRICE][PREV] = MAXNUM;
        priceBook.cll[HEAD][NEXT] = MAXNUM;
        priceBook.cll[MAXNUM][NEXT] = MINPRICE;
        trading = true;
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
    
    /* Functions Getters */

    function etherBalanceOf(address _addr) public constant returns (uint) {
        return etherBalance[_addr];
    }

    function spread(bool _side) public constant returns(uint) {
        return step(priceBook,HEAD, _side);
    }

    function getAmount(uint _price, address _trader) 
        public constant returns(uint) {
        return amounts[sha3(_price, _trader)];
    }

    function sizeOf(uint l) constant returns (uint s) {
        if(l == 0) return sizeOf(priceBook);
        return sizeOf(orderFIFOs[l]);
    }
    
    function getPriceVolume(uint _price) public constant returns (uint v_)
    {
        uint n = step(orderFIFOs[_price],HEAD,NEXT);
        while (n != HEAD) { 
            v_ += amounts[sha3(_price, address(n))];
            n = step(orderFIFOs[_price],n, NEXT);
        }
        return;
    }

    function getBook() public constant returns (uint[])
    {
        uint i; 
        uint p = step(priceBook,MINNUM, NEXT);
        uint[] memory volumes = new uint[](sizeOf(priceBook) * 2 - 2);
        while (p < MAXNUM) {
            volumes[i++] = p;
            volumes[i++] = getPriceVolume(p);
            p = step(priceBook,p, NEXT);
        }
        return volumes; 
    }
    
    function numOrdersOf(address _addr) public constant returns (uint)
    {
        uint c;
        uint p = MINNUM;
        while (p < MAXNUM) {
            if (amounts[sha3(p, _addr)] > 0) c++;
            p = step(priceBook,p, NEXT);
        }
        return c;
    }
    
    function getOpenOrdersOf(address _addr) public constant returns (uint[])
    {
        uint i;
        uint c;
        uint p = MINNUM;
        uint[] memory open = new uint[](numOrdersOf(_addr)*2);
        p = MINNUM;
        while (p < MAXNUM) {
            if (amounts[sha3(p, _addr)] > 0) {
                open[i++] = p;
                open[i++] = amounts[sha3(p, _addr)];
            }
            p = step(priceBook,p, NEXT);
        }
        return open;
    }

    function getNode(uint _list, uint _node) public constant returns(uint[2])
    {
        return [orderFIFOs[_list].cll[_node][PREV], 
            orderFIFOs[_list].cll[_node][NEXT]];
    }
    
    /* Functions Public */

// Here non-constant public functions act as a security layer. They are re-entry
// protected so cannot call each other. For this reason, they
// are being used for parameter and enterance validation, while internal
// functions manage the logic. This also allows for deriving contracts to
// overload the public function with customised validations and not have to
// worry about rewritting the logic.

    function buy (uint _bidPrice, uint _amount, bool _make)
        payable
        canEnter
        isTrading
        isValidBuy(_bidPrice, _amount)
        returns (bool)
    {
        trade(_bidPrice, _amount, BID, _make);
        return true;
    }

    function sell (uint _askPrice, uint _amount, bool _make)
        external
        canEnter
        isTrading
        isValidSell(_askPrice, _amount)
        returns (bool)
    {
        trade(_askPrice, _amount, ASK, _make);
        return true;
    }

    function withdraw(uint _ether)
        external
        canEnter
        hasEther(msg.sender, _ether)
        returns (bool success_)
    {
        etherBalance[msg.sender] -= _ether;
        safeSend(msg.sender, _ether);
        success_ = true;
    }

    function cancel(uint _price)
        external
        canEnter
        returns (bool)
    {
        TradeMessage memory tmsg;
        tmsg.price = _price;
        tmsg.balance = balanceOf[msg.sender];
        tmsg.etherBalance = etherBalance[msg.sender];
        cancelIntl(tmsg);
        balanceOf[msg.sender] = tmsg.balance;
        etherBalance[msg.sender] = tmsg.etherBalance;
        return true;
    }
    
    function setTrading(bool _trading)
        external
        onlyCentralOffice
        canEnter
        returns (bool)
    {
        trading = _trading;
        Trading(true);
        return true;
    }

/* Functions Internal */

// Internal functions handle this contract's logic.

    function trade (uint _price, uint _amount, bool _side, bool _make) internal {
        TradeMessage memory tmsg;
        tmsg.price = _price;
        tmsg.tradeAmount = _amount;
        tmsg.side = _side;
        tmsg.make = _make;
        
        // Cache state balances to memory and commit to storage only once after trade.
        tmsg.balance  = balanceOf[msg.sender];
        tmsg.etherBalance = etherBalance[msg.sender] + msg.value;

        take(tmsg);
        make(tmsg);
        
        balanceOf[msg.sender] = tmsg.balance;
        etherBalance[msg.sender] = tmsg.etherBalance;
    }
    
    function take (TradeMessage tmsg)
        internal
    {
        address maker;
        bytes32 orderHash;
        uint takeAmount;
        uint takeEther;
        // use of signed math on unsigned ints is intentional
        uint sign = tmsg.side ? uint(1) : uint(-1);
        uint bestPrice = spread(!tmsg.side);

        // Loop with available gas to take orders
        while (
            tmsg.tradeAmount > 0 &&
            cmpEq(tmsg.price, bestPrice, !tmsg.side) && 
            msg.gas > MINGAS
        )
        {
            maker = address(step(orderFIFOs[bestPrice],HEAD, NEXT));
            orderHash = sha3(bestPrice, maker);
            if (tmsg.tradeAmount < amounts[orderHash]) {
                // Prepare to take partial order
                amounts[orderHash] = safeSub(amounts[orderHash], tmsg.tradeAmount);
                takeAmount = tmsg.tradeAmount;
                tmsg.tradeAmount = 0;
            } else {
                // Prepare to take full order
                takeAmount = amounts[orderHash];
                tmsg.tradeAmount = safeSub(tmsg.tradeAmount, takeAmount);
                closeOrder(bestPrice, maker);
            }
            takeEther = safeMul(bestPrice, takeAmount);
            // signed multiply on uints is intentional and so safeMaths will 
            // break here. Valid range for exit balances are 0..2**128 
            tmsg.etherBalance += takeEther * sign;
            tmsg.balance -= takeAmount * sign;
            if (tmsg.side) {
                // Sell to bidder
                if (msg.sender == maker) {
                    // bidder is self
                    tmsg.balance += takeAmount;
                } else {
                    balanceOf[maker] += takeAmount;
                }
            } else {
                // Buy from asker;
                if (msg.sender == maker) {
                    // asker is self
                    tmsg.etherBalance += takeEther;
                } else {                
                    etherBalance[maker] += takeEther;
                }
            }
            Sale (bestPrice, takeAmount, msg.sender, maker, tmsg.side);
            // prep for next order
            bestPrice = spread(!tmsg.side);
        }
    }

    function make(TradeMessage tmsg)
        internal
    {
        bytes32 orderHash;
        if (tmsg.tradeAmount == 0 || !tmsg.make || msg.gas < MINGAS) return;
        orderHash = sha3(tmsg.price, msg.sender);
        if (amounts[orderHash] != 0) {
            // Cancel any pre-existing owned order at this price
            cancelIntl(tmsg);
        }
        if (!exists(orderFIFOs[tmsg.price])) {
            // Register price in pricebook
            insert(priceBook,
                seek(priceBook,HEAD, tmsg.price, tmsg.side),
                tmsg.price, !tmsg.side);
        }

        amounts[orderHash] = tmsg.tradeAmount;
        push(orderFIFOs[tmsg.price],uint(msg.sender), PREV); 

        if (tmsg.side) {
            tmsg.balance -= tmsg.tradeAmount;
            Ask (tmsg.price, tmsg.tradeAmount, msg.sender);
        } else {
            tmsg.etherBalance -= tmsg.tradeAmount * tmsg.price;
            Bid (tmsg.price, tmsg.tradeAmount, msg.sender);
        }
    }

    function cancelIntl(TradeMessage tmsg) internal {
        uint amount = amounts[sha3(tmsg.price, msg.sender)];
        if (amount == 0) return;
        if (tmsg.price > spread(BID)) tmsg.balance += amount; // was ask
        else tmsg.etherBalance += tmsg.price * amount; // was bid
        closeOrder(tmsg.price, msg.sender);
    }

    function closeOrder(uint _price, address _trader) internal {
        remove(orderFIFOs[_price],uint(_trader));
        if (!exists(orderFIFOs[_price]))  {
            remove(priceBook,_price);
        }
        delete amounts[sha3(_price, _trader)];
    }
    
   function() public payable {
    } 
    
    function issue(uint256 _fromId, uint256 _toId, uint _value)       external
        canEnter
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
    
     
         // Send _value amount of tokens to address _to
    function transfer(uint256 _toId, uint256 _value)
        external
        canEnter
        isAvailable(_value)
        returns (bool)
    {
        address _to = chikwama.getChikwama(_toId);
        balanceOf[msg.sender] = safeSub(balanceOf[msg.sender], _value);
        balanceOf[_to] = safeAdd(balanceOf[_to], _value);
        Transfer(msg.sender, _to, _value);
        return true;
    }
      /// @notice Send `_value` tokens to `_to` in behalf of `_from`
    /// @param _from The address of the sender
    /// @param _to The address of the recipient
    /// @param _value the amount to send
    function transferFrom(address _from,uint256 _fromId, address _to, uint256 _toId, uint _value) external
        canEnter
        isAllowed(chikwama.getChikwama(_fromId), _value)
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
        return true;
    }
    
      /// @notice Allows `_spender` to spend no more than `_value` tokens in your behalf
    /// @param _spender The address authorized to spend
    /// @param _value the max amount they can spend
    function approve(address _spender, uint256 _value) external
        canEnter
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