var Account = artifacts.require("./Account.sol");
var TokenManager = artifacts.require("./TokenManager.sol");
var tokenName = "Chikwama Pegged Token";
var tokenSymbol = "CPT";
var FiatPeggedToken = artifacts.require("./FiatPeggedToken.sol");
var Exchange = artifacts.require("./Exchange.sol");

module.exports = function(deployer) {
  deployer.deploy(Account).then(function() {
    return deployer.deploy(TokenManager, Account.address);
  });

  deployer.deploy(FiatPeggedToken,tokenName,tokenSymbol).then(function() {
    return deployer.deploy(Exchange, FiatPeggedToken.address);
  });
};
