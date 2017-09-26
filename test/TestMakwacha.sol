pragma solidity ^0.4.11;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Makwacha.sol";

contract TestMakwacha {
  Makwacha makwacha = Makwacha(DeployedAddresses.MakwachaToken());

}