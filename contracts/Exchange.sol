/*
file:   Exchange.sol


An ERC20 compliant token with currency
exchange functionality 

*/

pragma solidity ^0.4.13;


import "./ERC20.sol";

contract Exchange
{

    uint256 public sizeOf;
    ERC20 erc20;

    struct Trade
    {
        address trader;
        bool side; //true = sell, false =buy 
        uint256 price;
        uint256 tokens;
        
    }
   
    Trade public trade;
    

    mapping(address => uint256) public tradeBalance;
    
    mapping(uint256 => Trade) public priceBook;

     // Mapping for ether ownership of accumulated deposits, sales and refunds.
    mapping (address => uint) etherBalance;

    event TradeResult(string);

    function etherBalanceOf(address _addr) public constant returns (uint) {
        return _addr.balance;
    }

    function() public payable {
    }

    function buy(uint256 _price, uint256 _tokens) public returns(bool success)
    {
        trade.trader = msg.sender;
        trade.side = false;
        trade.price = _price;
        trade.tokens = _tokens;
        
        //Check if valid trade
        if(etherBalanceOf(trade.trader)<etherBalance[trade.trader]+(_price*_tokens)|| _tokens==0)
        return false;
          
          // Check if this is the first entry in the price book
        if(sizeOf ==0)
        {
            priceBook[sizeOf] = trade;
            sizeOf++;
            return true;
        }
        
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
        
        //Check if valid trade
        if(erc20.balanceOf(trade.trader)<_tokens + tradeBalance[trade.trader] || _tokens == 0)
        return false;
        
         // Check if this is the first entry in the price book
        if(sizeOf ==0)
        {
            tradeBalance[trade.trader] += _tokens;
            priceBook[sizeOf] = trade;
            sizeOf++;
            return true;
        }
        
        tradeBalance[trade.trader] += _tokens;
        setTrade(trade);
 
        return true;
    }
    
    //transfer tokens from seller to buyer and ether from buyer to seller
    function make(uint256 _tokens,uint256 _price, address _buyer, address _seller)internal returns (bool success)
    {   uint tradeValue = _tokens*_price;
        
        if(_seller.send(tradeValue)){
        etherBalance[_buyer] =etherBalance[_buyer]-tradeValue;
        erc20.transfer(_buyer, _tokens);
        return true;
        }
        
        return false;
    }
    
    
    function withdraw(bool _side, uint256 _tokens, uint256 _price) internal returns(bool)
    {
        uint256 _amount = _tokens * _price;
        //check if seller, then withdraw amount from trade contract
        if(_side)
        {
            if(tradeBalance[msg.sender]>=_tokens){
                tradeBalance[msg.sender]-=_tokens;
                return true;
            }
            return false;
        }
        
        
        //if buyer, then withdraw amount from trade contract
        if(etherBalance[msg.sender]>= _amount)
        {
            etherBalance[msg.sender]-=_amount;
            return true;
        }
        
        return false;
    }
    
    function  cancelTrade(bool _side, uint256 _price) returns(bool) 
    {
        for(uint x = 0; x<=sizeOf; x++)
        {
            if(priceBook[x].side == _side && priceBook[x].trader ==  msg.sender && priceBook[x].price == _price)
            {
                delete priceBook[x];
                return withdraw(_side,priceBook[x].tokens,_price);
                
            }
            
        }

    }
    
    function setTrade(Trade _trade) internal 
    {
      
        
        for(uint x = 0; x<=sizeOf; x++)
        {
           
            //Check if the trade is a buy or sell and try and make the trade against trades already in the price book else add the trade to the price book
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
    



    
}