var Account = artifacts.require("./Account.sol");

module.exports = function(deployer) {
  deployer.deploy(Account);
};
