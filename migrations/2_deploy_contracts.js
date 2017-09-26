var MakwachaToken = artifacts.require("./MakwachaToken.sol");
var Chikwama = artifacts.require("./Chikwama.sol")

module.exports = function(deployer) {
  deployer.deploy(Chikwama).then (function() {
    deployer.deploy(MakwachaToken,Chikwama.address);
  });
  
  
};