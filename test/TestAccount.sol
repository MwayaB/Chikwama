pragma solidity ^0.4.11;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Account.sol";


contract TestAccount{

Account account = Account(DeployedAddresses.Account());

function testAccountCreate()
{
  bool  returned = account.createChikwama( 0 , 112233,1,1234);

  bool expected = true;

  Assert.equal(returned, expected, "Account should be recorded");
}

/*function testGetAccount()
{
   address expected = this;
   address account = account.getChikwama(112233,0 , 112233,1,1234) ;

   Assert.equal(expected, account, "Account should be recorded");
}*/

function testCheckPin()
{
  bool expected = true;

  bool  returned = account.checkPin(  112233,1234);

  Assert.equal(returned, expected, "Account should be recorded");
}


}
