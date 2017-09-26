App = {
  
  web3Provider: null,
  contracts: {},

  initWeb3: function() {
    // Is there is an injected web3 instance?
if (typeof web3 !== 'undefined') {
  App.web3Provider = web3.currentProvider;
  web3 = new Web3(web3.currentProvider);
} else {
  // If no injected web3 instance is detected, fallback to the TestRPC.
  App.web3Provider = new web3.providers.HttpProvider('http://localhost:8545');
  web3 = new Web3(App.web3Provider);
}

    return App.initContract();
  },

  initContract: function() 
  {
    $.getJSON('MakwachaToken.json', function(data) 
    {
        // Get the necessary contract artifact file and instantiate it with truffle-contract.
        var MakwachaArtifact = data;
        App.contracts.MakwachaToken = TruffleContract(MakwachaArtifact);

        // Set the provider for our contract.
        App.contracts.MakwachaToken.setProvider(App.web3Provider);

    
    });

    $.getJSON('Chikwama.json', function(data)
    {
        // Get the necessary contract artifact file and instantiate it with truffle-contract.
        var ChikwamaArtifact = data;
        App.contracts.Chikwama = TruffleContract(ChikwamaArtifact);

        // Set the provider for our contract.
        App.contracts.Chikwama.setProvider(App.web3Provider);

    
    });
    $(document).on('click', '#loginButton', App.handleLogin);
    
  },

    bindEvents: function(id) {
      
      $(document).on('click', '#createButton', App.handleCreate(id));
    $(document).on('click', '#approveButton', App.handleApproval);
    $(document).on('click', '#issueButton', App.handleIssue);
    $(document).on('click', '#transferButton', App.handleTransfer);
    $(document).on('click', '#withdrawButton', App.handleWithdrawal);
  },

  handleLogin: function()
  {
     web3.eth.getAccounts(function(error, accounts) {
  if (error) {
    console.log(error);
  }

  var account = accounts[0];
    
    var id = parseInt($('#TTAccId').val());
    var pin = parseInt($('#TTAccPin').val());

    console.log(id +' is trying to log in');
    var chikwamaInstance;
    
    

      App.contracts.Chikwama.deployed().then(function(instance) {
        chikwamaInstance = instance;

        return chikwamaInstance.checkPin(id,pin);
      }).then(function(result) {
        if(result)
        {alert(id +' Logged in');
        return App.bindEvents(id);}
          })
    });

  },

  handleCreate: function(thisId) {
    var account = App.getAccount(thisId);

    var id = parseInt($('#TTChikwamaId').val());
    var type = parseInt($('#TTChikwamaType').val());
    var address = $('#TTChikwamaAddress').val();
    var pin = parseInt($('#TTChikwamaPin').val());
    var value = 0;

    console.log('Create Account' + id + ' address ' + address + ' Type ' + type);

    var chikwamaInstance;


      App.contracts.Chikwama.deployed().then(function(instance) {
        chikwamaInstance = instance;

        return chikwamaInstance.createChikwama(address, value, id, type, pin);
      }).then(function(result) {
        if(result)alert('Account Created!');
          }).catch(function(err) {
        console.log(err.message);
      });
   
  },
  

  handleIssue: function(thisId) {
    
    var account = App.getAccount(thisId);
    var id = parseInt($('#TTIssueID').val());
    var amount = parseInt($('#TTIssueAmount').val());
    var toAddress = App.getAccount(id);

    console.log('Issue ' + amount + ' MK to ' + toAddress);

    var makwachaTokenInstance;

   

      var account = App.getAccount(thisId);
      var transferFee = 1500;

      App.contracts.MakwachaToken.deployed().then(function(instance) {
        makwachaTokenInstance = instance;

        return makwachaTokenInstance.issue(toAddress, id, amount, transferFee);
      }).then(function(result) {
        if(result)alert('Issue Successful!');
        return App.getBalances(account,id);
      })
  
  },

  handleTransfer: function(thisId) {
    
    var account = App.getAccount(thisId);
    var fromId = parseInt($('#TTFromID').val());
    var amount = parseInt($('#TTTransferAmount').val());
    var toId = $parseInt($('#TTToId').val());
    var pin = parseInt($('#TTTransferPin').val());

    console.log('Transfer ' + amount +' from '+ FromId + ' MK to ' + toId);

    var makwachaTokenInstance;

      var transferFee = 1500;

      App.contracts.MakwachaToken.deployed().then(function(instance) {
        makwachaTokenInstance = instance;
        
        return makwachaTokenInstance.transferFrom(App.getAccount(fromId), fromId, App.getAccount(toId), toId, amount, transferFee);
      }).then(function(result) {
        if(result)alert('Transfer Successful!');
        return App.getBalances(account,fromId);
      }).catch(function(err) {
        console.log(err.message);
      });
    
  },

handleApproval: function(thisId) {
   

    var account = App.getAccount(thisId);
    
    var spender = parseInt($(App.getAccount('#TTAppId')));
    var amount = parseInt($(App.getAccount('#TTAppAmount')));

    console.log('Approve ' + amount + spender);

    var makwachaTokenInstance;

  

      App.contracts.MakwachaToken.deployed().then(function(instance) {
        makwachaTokenInstance = instance;
        return makwachaTokenInstance.approve(spender,amount);
      }).then(function(result) {
        alert(result);
        allowance = App.getAllowance(account,spender);
        $('#TTApproved').text(allowance);
      }).catch(function(err) {
        console.log(err.message);
      });
    
  },

 getBalances: function(acc,id) {
  

      var account = acc;

      console.log('Getting balances...');

      var makwachaTokenInstance;

      App.contracts.makwachaToken.deployed().then(function(instance) {
        makwachaTokenInstance = instance;

        return makwachaTokenInstance.balanceOf(App.getAccount(id));
      }).then(function(result) {
        balance = result;

        $('#TTBalance').text(balance);
      }).catch(function(err) {
        console.log(err.message);
      });
    
  },

  getAllowance: function(acc,spender)
  {
      var account = acc;

      console.log('Getting Allowance...');

      var makwachaTokenInstance;

      App.contracts.makwachaToken.deployed().then(function(instance) {
        makwachaTokenInstance = instance;

        return makwachaTokenInstance.allowance(account, spender);
      }).then(function(result) {
        allowance = result;

        return allowance;
      }).catch(function(err) {
        console.log(err.message);
      });
  },

  getAccount: function(id)
  {
      web3.eth.getAccounts(function(error, accounts) {
  if (error) {
    console.log(error);
  }

  var account = accounts[0];

      console.log('Getting account address...');

      var chikwamaInstance;

      App.contracts.Chikwama.deployed().then(function(instance) {
        chikwamaInstance = instance;

        return chikwamaInstance.getChikwama(id);
      }).then(function(result) {
        address = result;

        return address;
      }).catch(function(err) {
        console.log(err.message);
      });
  });
  }
  };

$(function() {
  $(window).load(function() {
    App.initWeb3();
  });
});
