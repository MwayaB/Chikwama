var Account = artifacts.require("./Account.sol");
var Base = artifacts.require("./Base.sol");
var Erc20 = artifacts.require("./ERC20.sol");
var Exchange = artifacts.require("./Exchange.sol");

module.exports = function(deployer) {
  deployer.deploy(Account).then(function() {
    return deployer.deploy(Base, Account.address);
  });

  deployer.deploy(Erc20);
  deployer.deploy(Exchange);
};
